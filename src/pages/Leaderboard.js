import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase-config';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      const userList = snapshot.docs.map(doc => doc.data());

      // Sort by XP (descending)
      userList.sort((a, b) => b.xp - a.xp);
      setUsers(userList);
    };

    fetchLeaderboard();
  }, []);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>🏆 Leaderboard</h2>
      <table style={{ width: '100%', marginTop: '2rem', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f0f0f0' }}>
            <th>#</th>
            <th>Profile</th>
            <th>Name</th>
            <th>XP</th>
            <th>Streak 🔥</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index} style={{ borderBottom: '1px solid #ccc' }}>
              <td><b>{index + 1}</b></td>
              <td>
                <img
                  src={user.photo || 'https://via.placeholder.com/40'}
                  alt="avatar"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/40';
                  }}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                  }}
                />
              </td>
              <td>{user.name}</td>
              <td>{user.xp}</td>
              <td>{user.streak || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
