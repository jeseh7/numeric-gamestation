import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Landing from './Landing';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from './pages/loginPage';
import Game from './pages/game';
import { onAuthStateChanged } from 'firebase/auth';
import { ProtectedRoute } from './components/protectedRoute';
import { auth } from './firebase';
import { createTable } from './initializeDatabase'; // Import the createTable function
import Leaderboard from './pages/leaderboard';
import loadingGif from './img/loading.gif';
import Gamemodes from './pages/gamemodes';
import Hardgame from './pages/hardgame';

const App = () => {
  const [user, setUser] = useState(null);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    // Call the createTable function when the component mounts
    createTable();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setIsFetching(false);
      } else {
        setUser(null);
        setIsFetching(false);
      }
    });
    return () => unsubscribe();
  }, []);

  if (isFetching) {
    return (
      <div className="loading-container">
        <img src={loadingGif} alt="Loading..." className="loading-gif" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing user={user} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/game" element={<ProtectedRoute user={user}><Game /></ProtectedRoute>} />
        <Route path="/hardgame" element={<ProtectedRoute user={user}><Hardgame /></ProtectedRoute>} />
        <Route path="/gamemodes" element={<ProtectedRoute user={user}><Gamemodes /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
};


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals.console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
