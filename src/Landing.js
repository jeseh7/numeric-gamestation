import './Landing.css';
import numeric from './img/numeric.png';

function Landing() {
  return (
    <div className='landingBody'>
      <img src={numeric} className="App-logo" alt="logo" id='numeric' />
      <p className='landingText1'>
      10 Billion Possible Responses.
      </p>
      <p className='landingText2'>
        Pick The Correct <a className='landingBlur'>Ten ⭐</a>
      </p>
      <a className='playButton'>
        Play
      </a>
      <a className='loginButton'>
        Login
      </a>
    </div>
  );
}

export default Landing;
