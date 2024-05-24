import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { supabase } from '../supabase';
import './game.css'; // Import the CSS file

const generateDailyNumber = () => {
  let number = '';
  for (let i = 0; i < 10; i++) {
    number += Math.floor(Math.random() * 10).toString();
  }
  return number;
};

const Game = () => {
  const [dailyNumber, setDailyNumber] = useState(generateDailyNumber());
  const [currentGuess, setCurrentGuess] = useState(new Array(10).fill('_'));
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [bestAttempt, setBestAttempt] = useState(null);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userIdentifier = user.displayName || user.email;
        setUsername(userIdentifier);
        const { data, error } = await supabase
          .from('attempts')
          .select('attempts')
          .eq('username', userIdentifier)
          .single();
        if (error) {
          console.error("Error fetching attempts:", error);
          // If the user doesn't exist, insert a new record
          if (error.code === 'PGRST116') {
            await supabase
              .from('attempts')
              .insert({ username: userIdentifier, attempts: '[]' });
          }
        } else if (data && data.attempts) {
          const attemptsArray = JSON.parse(data.attempts);
          setBestAttempt(Math.min(...attemptsArray));
        }
      }
    };
    fetchUserData();
  }, []);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => console.log("Sign Out"))
      .catch((error) => console.log(error));
  };

  const handleInputChange = (e) => {
    setGuess(e.target.value);
  };

  const submitGuess = () => {
    if (guess.length !== 10) {
      alert('Please enter a 10-digit number.');
      return;
    }

    setAttempts(attempts + 1);

    let newGuess = [...currentGuess];
    for (let i = 0; i < 10; i++) {
      if (guess[i] === dailyNumber[i]) {
        newGuess[i] = dailyNumber[i];
      } else {
        newGuess[i] = '_';
      }
    }

    setCurrentGuess(newGuess);

    if (newGuess.join('') === dailyNumber) {
      setFeedback(`Congratulations! You guessed the number in ${attempts} attempts.`);
      updateBestAttempt(attempts);
      setIsGameComplete(true);
    } else {
      setFeedback('Keep trying!');
    }

    setGuess('');
  };

  const updateBestAttempt = async (currentAttempts) => {
    const user = auth.currentUser;
    if (user) {
      const userIdentifier = user.displayName || user.email;
      const { data, error } = await supabase
        .from('attempts')
        .select('attempts')
        .eq('username', userIdentifier)
        .single();

      let attemptsArray = [];
      if (data && data.attempts) {
        attemptsArray = JSON.parse(data.attempts);
      }
      attemptsArray.push(currentAttempts);

      // Sort the attempts array in ascending order
      attemptsArray.sort((a, b) => a - b);

      const { error: upsertError } = await supabase
        .from('attempts')
        .upsert({ username: userIdentifier, attempts: JSON.stringify(attemptsArray) }, { onConflict: ['username'] });

      if (upsertError) {
        console.error("Error updating attempts:", upsertError);
      } else {
        setBestAttempt(Math.min(...attemptsArray));
      }
    }
  };

  const handleReplay = () => {
    setDailyNumber(generateDailyNumber());
    setCurrentGuess(new Array(10).fill('_'));
    setGuess('');
    setAttempts(0);
    setFeedback('');
    setIsGameComplete(false);
  };

  return (
    <section className='gameSection'>
      <h2 className='gameTitle'>GAME</h2>
      <div id="game-board">
        {currentGuess.map((digit, index) => (
          <span key={index} className="digit">{digit}</span>
        ))}
      </div>
      <input
        className='gameInput'
        type="text"
        value={guess}
        onChange={handleInputChange}
        maxLength="10"
        placeholder="Enter your guess"
        disabled={isGameComplete} // Disable input when the game is complete
      />
      <button className='gameButton' onClick={submitGuess} disabled={isGameComplete}>Submit Guess</button>
      {isGameComplete && <button className='gameButton' onClick={handleReplay}>Replay</button>}
      <p id="feedback">{feedback}</p>
      <p id="attempts">Attempts: {attempts}</p>
      {bestAttempt !== null && <p className="best-attempt">Best Attempt: {bestAttempt}</p>}
      <button className='gameButton' onClick={handleSignOut}>Sign Out</button>
    </section>
  );
};

export default Game;
