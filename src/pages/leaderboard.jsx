import React, { useState, useEffect } from 'react';
import './leaderboard.css'; // Import the CSS file
import { supabase } from '../supabase'; // Import Supabase client
import Paginator from '../components/paginator';

const Leaderboard = () => {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [mode, setMode] = useState('normal');
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchLeaderboardData = async () => {
            try {
                const tableName = mode === 'normal' ? 'attempts' : 'hardattempts';
                const { data: attemptsData, error } = await supabase
                    .from(tableName)
                    .select('username, attempts')
                    .order('attempts', { ascending: true });

                if (error) {
                    throw error;
                }

                const leaderboard = await Promise.all(attemptsData.map(async (attempt) => {
                    const firstNumber = JSON.parse(attempt.attempts)[0];
                    const { data: userData, error: userError } = await supabase
                        .from('user_profiles')
                        .select('username')
                        .eq('email', attempt.username)
                        .single();

                    if (userError) {
                        throw userError;
                    }

                    return {
                        username: userData.username,
                        attempt: parseInt(firstNumber)
                    };
                }));

                leaderboard.sort((a, b) => a.attempt - b.attempt);

                setLeaderboardData(leaderboard);
            } catch (error) {
                console.error('Error fetching leaderboard data:', error);
            }
        };

        fetchLeaderboardData();
    }, [mode]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleModeChange = (newMode) => {
        setMode(newMode);
        setCurrentPage(1); // Reset to first page on mode change
    };

    const maxPages = Math.ceil(leaderboardData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentPageData = leaderboardData.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="leaderboard-container">
            <h2 className="leaderboard-title">Leaderboard</h2>
            <div className="mode-selector">
                <button className={mode === 'normal' ? 'active' : ''} onClick={() => handleModeChange('normal')}>Normal</button>
                <button className={mode === 'hard' ? 'active' : ''} onClick={() => handleModeChange('hard')}>Hard</button>
            </div>
            <ul className="leaderboard-list">
                {currentPageData.map((entry, index) => (
                    <li key={index} className="leaderboard-item">
                        <span className="leaderboard-position">{startIndex + index + 1}.</span>
                        <span className="leaderboard-username">{entry.username}</span>
                        <span className="leaderboard-attempt">{entry.attempt} attempts</span>
                    </li>
                ))}
            </ul>
            <Paginator
                currentPage={currentPage}
                maxPages={maxPages}
                onPageChange={handlePageChange}
            />
            <div className="home-button-container">
                <a className='gameButton2' href='/'>Home</a>
            </div>
        </div>
    );
};

export default Leaderboard;
