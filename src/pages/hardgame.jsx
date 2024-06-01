import React, { useState, useEffect, useRef } from 'react';
import { auth } from '../firebase';
import { supabase } from '../supabase';
import './hardgame.css'; // Import the CSS file
import { useTheme } from '../ThemeContext'; // Import the useTheme hook


const generateDailyNumber = () => {
  let number = '';
  for (let i = 0; i < 10; i++) {
    number += Math.floor(Math.random() * 10).toString();
  }
  return number;
};

const Hardgame = () => {
  const [dailyNumber, setDailyNumber] = useState(generateDailyNumber());
  const [currentGuess, setCurrentGuess] = useState(new Array(10).fill('_'));
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [bestAttempt, setBestAttempt] = useState(null);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [username, setUsername] = useState('');
  const { theme } = useTheme(); // Access the theme context

  const inputRef = useRef(null); // Create a ref for the input element

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userIdentifier = user.displayName || user.email;
        setUsername(userIdentifier);
        const { data, error } = await supabase
          .from('hardattempts')
          .select('attempts')
          .eq('username', userIdentifier)
          .single();
        if (error) {
          console.error("Error fetching attempts:", error);
          // If the user doesn't exist, insert a new record
          if (error.code === 'PGRST116') {
            await supabase
              .from('hardattempts')
              .insert({ username: userIdentifier, attempts: '[]' });
          }
        } else if (data && data.attempts) {
          const attemptsArray = JSON.parse(data.attempts);
          setBestAttempt(Math.min(...attemptsArray));
        }
      }
    };
    fetchUserData();

    // Focus on the input field when the component mounts
    inputRef.current.focus();
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\D/, ''); // Replace non-digit characters with an empty string
    setGuess(value);
  };

  const submitGuess = () => {
    if (guess.length !== 10) {
      return;
    }

    setAttempts(attempts + 1);

    let newGuess = [...currentGuess];
    const correctIndexes = [];
    for (let i = 0; i < 10; i++) {
      if (guess[i] === dailyNumber[i]) {
        newGuess[i] = dailyNumber[i];
        correctIndexes.push(i);
      }
    }

    setCurrentGuess(newGuess);

    // Temporarily show correct digits
    correctIndexes.forEach(index => {
      const digitElement = document.getElementById(`digit-${index}`);
      digitElement.classList.add('correct');
    });

    setTimeout(() => {
      let resetGuess = [...currentGuess];
      correctIndexes.forEach(index => {
        resetGuess[index] = '_';
        const digitElement = document.getElementById(`digit-${index}`);
        digitElement.classList.remove('correct');
      });
      setCurrentGuess(resetGuess);
    }, 2500);

    if (newGuess.join('') === dailyNumber) {
      setFeedback(`Congratulations! You guessed the number in ${attempts} attempts.`);
      updateBestAttempt(attempts);
      setIsGameComplete(true);
    } else {
      setFeedback('Keep trying!');
    }

    setGuess('');
  };

  const handleReplay = () => {
    setDailyNumber(generateDailyNumber());
    setCurrentGuess(new Array(10).fill('_'));
    setGuess('');
    setAttempts(0);
    setFeedback('');
    setIsGameComplete(false);

    // Focus on the input field when the game restarts
    inputRef.current.focus();
  };

  const updateBestAttempt = async (currentAttempts) => {
    const user = auth.currentUser;
    if (user) {
      const userIdentifier = user.displayName || user.email;
      const { data, error } = await supabase
        .from('hardattempts')
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
        .from('hardattempts')
        .upsert({ username: userIdentifier, attempts: JSON.stringify(attemptsArray) }, { onConflict: ['username'] });

      if (upsertError) {
        console.error("Error updating attempts:", upsertError);
      } else {
        setBestAttempt(Math.min(...attemptsArray));
      }
    }
  };

  // Add event listener to listen for Enter key press
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        submitGuess();
      }
    };

    document.addEventListener('keypress', handleKeyPress);

    // Remove the event listener
    return () => {
      document.removeEventListener('keypress', handleKeyPress);
    };
  }, []);
  const handleNavigation = (url) => {
    window.location.href = url;
  };
  
  return (
    <section className={`gameSection ${theme}`}>
      <h2 className='gameTitle2'>HARD NUMERICAL GAME</h2>
      <div id="game-board">
        {currentGuess.map((digit, index) => (
          <span key={index} id={`digit-${index}`} className="digit">{digit}</span>
        ))}
      </div>
      <input
        ref={inputRef}
        className='gameInput'
        type="text"
        value={guess}
        onChange={handleInputChange}
        maxLength="10"
        placeholder="Enter your guess"
        disabled={isGameComplete} // Disable input when the game is complete
        pattern="[0-9]*" // Allow only numeric input
      />
      <button className='gameButton' onClick={submitGuess} disabled={isGameComplete}>Submit Guess</button>
      {isGameComplete && <button className='gameButton' onClick={handleReplay}>Replay</button>}
      <p id="feedback">{feedback}</p>
      <p id="attempts">Attempts: {attempts}</p>
      {bestAttempt !== null && <p className="best-attempt">Best Attempt: {bestAttempt}</p>}
      <button className='gameButton' onClick={() => handleNavigation('/')}>Home</button>
    </section>
  );
};

export default Hardgame;
