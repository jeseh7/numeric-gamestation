import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { supabase } from '../supabase'; // Import your Supabase instance
import './loginCSS.css';
import { ThemeProvider, useTheme } from '../ThemeContext';

export const Login = ({ user }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isSignUpActive, setIsSignUpActive] = useState(true);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const { theme } = useTheme(); // Access the theme context

  const handleMethodChange = () => {
    setIsSignUpActive(!isSignUpActive);
  };

  const handleSignUp = async () => {
    if (!email || !password || !username) return;

    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);

      // Store username in Supabase
      const { data, error: profileError } = await supabase
        .from('user_profiles')
        .insert([{ email, username, firebase_uid: firebaseUser.uid }]);

      if (profileError) {
        throw profileError;
      }

      console.log('User signed up successfully:', firebaseUser);
      navigate('/');
    } catch (error) {
      showAlert('Error signing up: ' + error.message, 'danger');
      console.error('Error signing up:', error.message);
    }
  };

  const handleSignIn = async () => {
    if (!email || !password) return;

    try {
      const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);

      console.log('User signed in successfully:', firebaseUser);
      navigate('/');
    } catch (error) {
      showAlert('Password Incorrect or No Account', 'danger');
      console.error('Error signing in:', error.message);
    }
  };

  const showAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);

    setTimeout(() => {
      setAlertMessage('');
      setAlertType('');
    }, 5000);
  };

  const handleEmailChange = (event) => setEmail(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);
  const handleUsernameChange = (event) => setUsername(event.target.value);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      isSignUpActive ? handleSignIn() : handleSignUp();
    }
  };

  if (user) {
    return null;
  }

  return (
    <section className={`loginSection ${theme}`}>
      <form className="loginPage" onKeyPress={handleKeyPress}>
        <fieldset className="fieldset">
          {!isSignUpActive && (
            <input
              className="input"
              type="text"
              id="username"
              placeholder="Username"
              onChange={handleUsernameChange}
            />
          )}
          <input
            className="input"
            type="text"
            id="email"
            placeholder="Email"
            onChange={handleEmailChange}
          />
          <input
            className="input"
            type="password"
            id="password"
            placeholder="Password"
            onChange={handlePasswordChange}
          />
          {!isSignUpActive && (
            <button type="button" className="loginPageButton" onClick={handleSignUp}>
              Sign Up
            </button>
          )}
          {isSignUpActive && (
            <button type="button" className="loginPageButton" onClick={handleSignIn}>
              Login
            </button>
          )}
          {!isSignUpActive && (
            <button className="switchButton" onClick={handleMethodChange}>
              Login
            </button>
          )}
          {isSignUpActive && (
            <button className="switchButton" onClick={handleMethodChange}>
              Create An Account
            </button>
          )}
        </fieldset>
        {alertMessage && (
          <div className={`alert alert-${alertType}`}>
            <span>{alertMessage}</span>
            <span className="close-btn" onClick={() => setAlertMessage('')}>&times;</span>
          </div>
        )}
      </form>
    </section>
  );
};

export default Login;