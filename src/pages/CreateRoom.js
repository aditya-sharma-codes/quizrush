import React from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase-config';
import { v4 as uuidv4 } from 'uuid';

const CreateRoom = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleCreateRoom = async () => {
    if (!user) {
      alert("Please login first!");
      navigate('/login');
      return;
    }

    const code = uuidv4().slice(0, 6).toUpperCase();

    const newRoom = {
      code,
      host: {
        uid: user.uid,
        name: user.name,
        photo: user.photo,
      },
      players: [
        {
          uid: user.uid,
          name: user.name,
          photo: user.photo,
          score: null,
          status: 'waiting',
        },
      ],
      status: 'waiting', // not started yet
      createdAt: Date.now(),
    };

    await setDoc(doc(db, 'rooms', code), newRoom);

    navigate(`/room/${code}`);
  };

  return (
    <div style={{ textAlign: 'center', padding: '3rem' }}>
      <h2>Create a Custom Battle Room</h2>
      <p>Invite your friends to play a quiz together! ⚔️</p>
      <button
        onClick={handleCreateRoom}
        style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px' }}
      >
        🚀 Create Room
      </button>
    </div>
  );
};

export default CreateRoom;
