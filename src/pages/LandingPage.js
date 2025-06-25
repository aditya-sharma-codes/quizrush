import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css'; // for optional styling

const LandingPage = () => {
  return (
    <div className="landing-container">
      <h1>Welcome to QuizRush ⚡</h1>
      <p>Gamified Quiz Battles for Students & Learners</p>
      
      <div className="buttons">
        <Link to="/daily">
          <button className="play-button">🔥 Play Daily Battle</button>
        </Link>
        <Link to="/leaderboard">
          <button className="leaderboard-button">🏆 Leaderboard</button>
        </Link>
        <Link to="/login">
          <button className="login-button">🔐 Login</button>
        </Link>
        <Link to="/createroom">
           <button className="custom-room-button">🛡️ Create Custom Room</button>
        </Link>
        
      </div>
    </div>
  );
};

export default LandingPage;
