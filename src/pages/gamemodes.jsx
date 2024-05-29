import React from 'react';
import './gamemodes.css';

export const Gamemodes = () => {
  return (
    <div className="gamemodeBody">
      <section className="gamemodeSection">
        <div className="gamemodeCardSection">
          <a href="/game" className="gamemodeCard">
            <p className="gamemodeTitle">Normal</p>
            <p className="gamemodeDesc">
            Guess a randomly generated 10-digit number. Receive feedback on correct digits in their correct positions. Track attempts and aim for the best score. Replay to improve.
            </p>
          </a>
        </div>
        <div className="gamemodeCardSection">
          <a href="/hardgame" className="gamemodeCard2">
            <p className="gamemodeTitle2">Hard</p>
            <p className="gamemodeDesc">
            Guess a 10-digit number with a twist – correct digits are briefly revealed before resetting. Test memory and strategy. Track attempts and aim for the best score.
            </p>
          </a>
        </div>
      </section>
    </div>
  );
};

export default Gamemodes;
