import React, { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';
import './Landing.css';
import numerical from './img/numerical_landingvid.mp4';
import numericalWebm from './img/numerical_landingvid.webm';
import { Dropdown } from 'react-bootstrap';
import { ThemeProvider, useTheme } from './ThemeContext';

const handleSignOut = () => {
  signOut(auth)
    .then(() => {
      console.log("Sign Out");
      window.location.href = '/'; // Redirect to the home page
    })
    .catch((error) => console.log(error));
};

const handleNavigation = (url) => {
  window.location.href = url;
};

function Landing() {
  const currentUser = auth.currentUser;
  const { theme, toggleTheme } = useTheme(); // Use the theme context
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');

  useEffect(() => {
    const video = document.getElementById('numeric');
    if (video) {
      video.muted = true;
      video.play().catch(error => console.log('Autoplay was prevented:', error));
    }
  }, []);

  const showAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);

    setTimeout(() => {
      setAlertMessage('');
      setAlertType('');
    }, 5000);
  };

  const handlePlayClick = () => {
    if (currentUser) {
      handleNavigation('/gamemodes');
    } else {
      showAlert('Please log in to play', 'warning');
    }
  };

  return (
    <div className={`landingBody ${theme}`}>
      {currentUser && (
        <div className={`dropdownContainer ${theme === 'dark' ? 'darkTheme' : ''}`}>
          <Dropdown>
            <Dropdown.Toggle variant={theme === 'dark' ? 'light' : 'dark'} id="dropdown-basic" className="dropdownToggle rounded">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-fill" viewBox="0 0 16 16">
                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
              </svg>
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item variant={theme === 'dark' ? 'light' : 'dark'} onClick={handleSignOut}>Sign Out</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      )}

      <video className="App-video" id='numeric' muted playsInline autoPlay loop style={{ filter: theme === 'dark' ? 'invert(85%)' : 'none' }}>
          <source src={numerical} type="video/mp4" />
          <source src={numericalWebm} type="video/webm" />
          Your browser does not support the video tag.
      </video>
      <p className='landingText1'>
        10 Billion Possible Responses.
      </p>
      <p className='landingText2'>
        Pick The Correct Ten ⭐
      </p>
      <div className='buttonContainer'>
        <button className='playSelection' onClick={handlePlayClick}>
          Play
        </button>
        {!currentUser && (
          <button className='loginSelection' onClick={() => handleNavigation('/login')}>
            Login
          </button>
        )}
        <button className='leaderboardSelection' onClick={() => handleNavigation('/leaderboard')}>
          Leaderboard
        </button>
      </div> 
      {/* Added container for the provided JSX */}
      <div className="bottomLeftContainer">
        
          <button className="themeToggle" onClick={toggleTheme}>
            {theme === 'dark' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-brightness-high" viewBox="0 0 16 16">
              <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6m0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708"/>
            </svg>         
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-moon" viewBox="0 0 16 16">
                <path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277q.792-.001 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278M4.858 1.311A7.27 7.27 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.32 7.32 0 0 0 5.205-2.162q-.506.063-1.029.063c-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286"/>
              </svg>
            )}
          </button>
        
      </div>
      {alertMessage && (
        <div className={`alert alert-${alertType}`}>
          <span>{alertMessage}</span>
          <span className="close-btn" onClick={() => setAlertMessage('')}>&times;</span>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Landing />
    </ThemeProvider>
  );
}
