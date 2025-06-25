import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DailyQuiz from './pages/DailyQuiz';
import Leaderboard from './pages/Leaderboard';
import Login from './pages/Login';
import RoomPage from './pages/RoomPage'; // import at top
import JoinRoom from './pages/JoinRoom'; // at the top
import RoomArena from './pages/RoomArena';
import CreateRoom from './pages/CreateRoom';







function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/daily" element={<DailyQuiz />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/room" element={<RoomPage />} />
        <Route path="/join" element={<JoinRoom />} />
        <Route path="/room/:code" element={<RoomArena />} />
        <Route path="/createroom" element={<CreateRoom />} />
      </Routes>
    </Router>
  );
}

export default App;
