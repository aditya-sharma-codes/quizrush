import React, { useState } from 'react';
import { db } from '../firebase-config';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const RoomPage = () => {
  const [roomCode, setRoomCode] = useState('');
  const navigate = useNavigate();

  const generateRoomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
  };

  const createRoom = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const code = generateRoomCode();

    await setDoc(doc(db, 'rooms', code), {
      host: {
        name: user.name,
        uid: user.uid,
        photo: user.photo,
      },
      players: [
        {
          name: user.name,
          uid: user.uid,
          score: 0
        }
      ],
      status: 'waiting'
    });

    navigate(`/room/${code}`);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Create a Battle Room</h2>
      <button onClick={createRoom}>🎮 Generate Room</button>
    </div>
  );
};

export default RoomPage;
