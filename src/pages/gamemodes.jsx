import React from 'react';
import './gamemodes.css';
import { useTheme } from '../ThemeContext'; // Import the useTheme hook

const handleNavigation = (url) => {
  window.location.href = url;
};

export const Gamemodes = () => {
  const { theme } = useTheme(); // Access the theme context

  return (
    <div className={`gamemodeBody ${theme}`}>
      <section className="gamemodeSection">
        <div className="gamemodeCardSection">
          <button className="gamemodeCard" onClick={() => handleNavigation('/game')}>
            <p className="gamemodeTitle">Normal</p>
            <p className="gamemodeDesc">
              Guess a randomly generated 10-digit number. Receive feedback on correct digits in their correct positions. Track attempts and aim for the best score. Replay to improve.
            </p>
          </button>
        </div>
        <div className="gamemodeCardSection">
          <button className="gamemodeCard2" onClick={() => handleNavigation('/hardgame')}>
            <p className="gamemodeTitle2">Hard</p>
            <p className="gamemodeDesc">
              Guess a 10-digit number with a twist - correct digits are briefly revealed before resetting. Test memory and strategy. Track attempts and aim for the best score.
            </p>
          </button>
        </div>
      </section>
    </div>
  );
};

export default Gamemodes;
