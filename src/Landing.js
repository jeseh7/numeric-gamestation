import React, { useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';
import './Landing.css';
import numerical from './img/numerical_landingvid.mp4';
import numericalWebm from './img/numerical_landingvid.webm';

const handleSignOut = () => {
  signOut(auth)
    .then(() => {
      console.log("Sign Out");
      window.location.href = '/'; // Redirect to the home page
    })
    .catch((error) => console.log(error));
};

function Landing() {
  const currentUser = auth.currentUser;

  useEffect(() => {
    const video = document.getElementById('numeric');
    if (video) {
      video.muted = true;
      video.play().catch(error => console.log('Autoplay was prevented:', error));
    }
  }, []);

  return (
    <div className='landingBody'>
      <video className="App-video" id='numeric' muted playsInline autoPlay loop>
        <source src={numerical} type="video/mp4" />
        <source src={numericalWebm} type="video/webm" />
        Your browser does not support the video tag.
      </video>
      <p className='landingText1'>
        10 Billion Possible Responses.
      </p>
      <p className='landingText2'>
        Pick The Correct <a className='landingBlur'>Ten ⭐</a>
      </p>
      <div className='buttonContainer'>
        <a className='playSelection' href='/game'>
          Play
        </a>
        {!currentUser && (
          <a className='loginSelection' href='/login'>
            Login
          </a>
        )}
        <a className='leaderboardSelection' href='/leaderboard'>
          Leaderboard
        </a>
        {currentUser && <button className='signOutButton' onClick={handleSignOut}>Sign Out</button>}
      </div>
    </div>
  );
}

export default Landing;
