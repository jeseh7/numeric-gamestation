import React, { useState, useEffect } from 'react';
import './leaderboard.css'; // Import the CSS file
import { supabase } from '../supabase'; // Import Supabase client

const Leaderboard = () => {
    const [leaderboardData, setLeaderboardData] = useState([]);

    useEffect(() => {
        const fetchLeaderboardData = async () => {
            try {
                // Fetch the top 100 best attempts from the attempts table
                const { data: attemptsData, error } = await supabase
                    .from('attempts')
                    .select('username, attempts') // Correct column name
                    .order('attempts', { ascending: true }) // Order by attempts in ascending order
                    .range(0, 99); // Get the top 100 attempts

                if (error) {
                    throw error;
                }

                // For each attempt, extract the first number from the attempts column
                const leaderboard = await Promise.all(attemptsData.map(async (attempt) => {
                    const firstNumber = JSON.parse(attempt.attempts)[0]; // Assuming attempts is an array
                    const { data: userData, error: userError } = await supabase
                        .from('user_profiles')
                        .select('username')
                        .eq('email', attempt.username) // Assuming 'username' in attempts table corresponds to 'email' in user_profiles table
                        .single();

                    if (userError) {
                        throw userError;
                    }

                    return {
                        username: userData.username,
                        attempt: parseInt(firstNumber) // Parse the attempt as a number
                    };
                }));

                // Sort the leaderboard by attempts in ascending order
                leaderboard.sort((a, b) => a.attempt - b.attempt);

                setLeaderboardData(leaderboard);
            } catch (error) {
                console.error('Error fetching leaderboard data:', error);
            }
        };

        fetchLeaderboardData();
    }, []);

    return (
        <div className="leaderboard-container">
            <h2 className="leaderboard-title">Leaderboard</h2>
            <ul className="leaderboard-list">
                {leaderboardData.map((entry, index) => (
                    <li key={index} className="leaderboard-item">
                        <span className="leaderboard-position">{index + 1}.</span>
                        <span className="leaderboard-username">{entry.username}</span>
                        <span className="leaderboard-attempt">{entry.attempt} attempts</span>
                    </li>
                ))}
            </ul>
            <div className="home-button-container">
                <a className='gameButton2' href='/'>Home</a>
            </div>
        </div>
    );
};

export default Leaderboard;
