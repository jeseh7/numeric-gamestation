import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';
import { supabase } from '../supabase';
import './loginCSS.css';
import { useTheme } from '../ThemeContext';

const profaneWords = [
  'ass', 'asshole', 'bastard', 'bitch', 'bloody', 'bollocks', 'bugger', 'bullshit',
  'chink', 'cock', 'crap', 'cunt', 'damn', 'dick', 'douche', 'fag', 'faggot', 'fuck',
  'goddamn', 'hell', 'homo', 'jerk', 'kike', 'motherfucker', 'nigger', 'piss', 'prick',
  'pussy', 'shit', 'slut', 'spic', 'twat', 'wanker', 'whore'
];

const profaneWordsRegex = new RegExp(profaneWords.join('|'), 'i');

export const Login = ({ user }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isSignUpActive, setIsSignUpActive] = useState(true);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const { theme } = useTheme();

  const handleMethodChange = () => {
    setIsSignUpActive(!isSignUpActive);
  };

  const containsProfanity = (text) => {
    return profaneWordsRegex.test(text);
  };

  const validateUsername = (username) => {
    if (username.length > 10) {
      showAlert('Username must be 10 characters or less', 'danger');
      return false;
    }
    if (containsProfanity(username)) {
      showAlert('Username contains inappropriate words', 'danger');
      return false;
    }
    return true;
  };

  const validatePassword = (password) => {
    const hasNumber = /\d/;
    if (password.length < 6 || !hasNumber.test(password)) {
      showAlert('Password must be at least 6 characters and contain a number', 'danger');
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    if (!email || !password || !username) return;

    if (!validateUsername(username) || !validatePassword(password)) return;

    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);

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

    if (!validatePassword(password)) return;

    try {
      const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);

      console.log('User signed in successfully:', firebaseUser);
      navigate('/');
    } catch (error) {
      showAlert('Password Incorrect or No Account', 'danger');
      console.error('Error signing in:', error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const { user: firebaseUser } = await signInWithPopup(auth, provider);
      const { displayName, email, uid } = firebaseUser;

      const { data: existingUser, error: checkError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('firebase_uid', uid)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (!existingUser) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert([{ email, username: displayName, firebase_uid: uid }]);

        if (profileError) {
          throw profileError;
        }
      }

      console.log('User signed in with Google successfully:', firebaseUser);
      navigate('/');
    } catch (error) {
      showAlert('Error signing in with Google: ' + error.message, 'danger');
      console.error('Error signing in with Google:', error.message);
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
        <button type="button" className="googleSignInButton" onClick={handleGoogleSignIn}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-google" viewBox="0 0 16 16">
            <path d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z"/>
          </svg>
          <span>{isSignUpActive ? 'Sign in with Google' : 'Create with Google'}</span>
        </button>
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
