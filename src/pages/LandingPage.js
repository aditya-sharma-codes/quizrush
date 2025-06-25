import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase-config';
import ThemeToggle from '../components/ThemeToggle';
import { ThemeContext } from '../ThemeContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [topUsers, setTopUsers] = useState([]);
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, 'users'));
      const allUsers = snapshot.docs.map(doc => doc.data());
      allUsers.sort((a, b) => b.xp - a.xp);
      setTopUsers(allUsers.slice(0, 3));
    };
    fetchUsers();
  }, []);

  const themeStyles = isDark ? dark : light;

  return (
    <div style={{ ...styles.wrapper, ...themeStyles.wrapper }}>
      <ThemeToggle />

      <h1 style={{ ...styles.heading, ...themeStyles.text }}>⚡ QuizRush</h1>
      <p style={{ ...styles.subheading, ...themeStyles.text }}>Battle, Learn, and Rise to the Top!</p>

      <div style={{ ...styles.card, ...themeStyles.card }}>
        {user ? (
          <div style={styles.userBox}>
            <img src={user.photo} alt="avatar" style={styles.avatar} />
            <span style={{ ...styles.userName, ...themeStyles.text }}>{user.name}</span>
          </div>
        ) : (
          <button onClick={() => navigate('/login')} style={styles.loginBtn}>
            🔐 Login with Google
          </button>
        )}
      </div>

      <div style={styles.buttonContainer}>
        <div style={{ ...styles.buttonCard, ...themeStyles.card }} onClick={() => navigate('/daily')}>
          📅 <span>Daily Quiz</span>
        </div>
        <div style={{ ...styles.buttonCard, ...themeStyles.card }} onClick={() => navigate('/room')}>
          ⚔️ <span>Create Room</span>
        </div>
        <div style={{ ...styles.buttonCard, ...themeStyles.card }} onClick={() => navigate('/join')}>
          🔗 <span>Join Room</span>
        </div>
        <div style={{ ...styles.buttonCard, ...themeStyles.card }} onClick={() => navigate('/leaderboard')}>
          🏆 <span>Leaderboard</span>
        </div>
      </div>

      <div style={{ ...styles.leaderboard, ...themeStyles.card }}>
        <h3 style={{ marginBottom: '10px', ...themeStyles.text }}>🔥 Top Players</h3>
        {topUsers.map((u, i) => (
          <div key={i} style={styles.leaderRow}>
            <span style={{ ...styles.rank, ...themeStyles.text }}>{i + 1}</span>
            <img src={u.photo} alt="avatar" style={styles.leaderAvatar} />
            <span style={{ ...styles.name, ...themeStyles.text }}>{u.name}</span>
            <span style={styles.xp}>⚡ {u.xp}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Themes
const light = {
  wrapper: {
    background: 'linear-gradient(to right, #fceabb, #f8b500)',
    transition: 'background 0.5s ease',
  },
  card: {
    backgroundColor: '#ffffff',
    color: '#000',
    transition: 'background-color 0.5s ease, color 0.5s ease',
  },
  text: {
    color: '#222',
    transition: 'color 0.5s ease',
  },
};

const dark = {
  wrapper: {
    background: 'linear-gradient(135deg, #1e1e2f, #2d2d44)',
    transition: 'background 0.5s ease',
  },
  card: {
    backgroundColor: '#2b2b3c',
    color: '#fff',
    transition: 'background-color 0.5s ease, color 0.5s ease',
  },
  text: {
    color: '#eee',
    transition: 'color 0.5s ease',
  },
};

// Base styles
const styles = {
  wrapper: {
    minHeight: '100vh',
    padding: '2rem 1rem',
    fontFamily: 'Poppins, sans-serif',
    textAlign: 'center',
    transition: 'background 0.5s ease, color 0.5s ease',
  },
  heading: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '0.3rem',
  },
  subheading: {
    fontSize: '1.1rem',
    marginBottom: '2rem',
  },
  card: {
    padding: '1rem',
    marginBottom: '2rem',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  userBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  },
  userName: {
    fontSize: '1rem',
    fontWeight: '500',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: '50%',
  },
  loginBtn: {
    background: '#007bff',
    color: '#fff',
    padding: '10px 20px',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  buttonContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
    marginBottom: '2rem',
  },
  buttonCard: {
    borderRadius: '12px',
    padding: '1rem',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, background-color 0.5s ease, color 0.5s ease',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  leaderboard: {
    textAlign: 'left',
    padding: '1rem',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  leaderRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
    gap: '10px',
  },
  rank: {
    width: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  leaderAvatar: {
    width: 30,
    height: 30,
    borderRadius: '50%',
  },
  name: {
    flex: 1,
    fontSize: '0.95rem',
  },
  xp: {
    fontWeight: '600',
    color: '#f9a825',
  },
};

export default LandingPage;
