import React, { useState, useEffect } from 'react';
import { signOut } from "firebase/auth"; 
import { auth } from "../firebase";
import './game.css';

const Game = () => {
  const [dailyNumber, setDailyNumber] = useState('');
  const [currentGuess, setCurrentGuess] = useState(new Array(10).fill('_'));
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const fetchDailyNumber = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/daily-number');
        const data = await response.json();
        setDailyNumber(data.number);
      } catch (error) {
        console.error("Error fetching the daily number:", error);
      }
    };
    fetchDailyNumber();
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
      setFeedback(`Congratulations! You guessed the number in ${attempts + 1} attempts.`);
    } else {
      setFeedback('Keep trying!');
    }

    setGuess('');
  };

  return (
    <section>
      <h2>GAME</h2>
      <div id="game-board">
        {currentGuess.map((digit, index) => (
          <span key={index} className="digit">{digit}</span>
        ))}
      </div>
      <input
        type="text"
        value={guess}
        onChange={handleInputChange}
        maxLength="10"
        placeholder="Enter your guess"
      />
      <button onClick={submitGuess}>Submit Guess</button>
      <p id="feedback">{feedback}</p>
      <p id="attempts">Attempts: {attempts}</p>
      <button onClick={handleSignOut}>Sign Out</button>
    </section>
  );
};

export default Game;
