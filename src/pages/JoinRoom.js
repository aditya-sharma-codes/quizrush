import React, { useState } from 'react';
import { db } from '../firebase-config';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const JoinRoom = () => {
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleJoin = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      setError('You must be logged in to join a room.');
      return;
    }

    const roomRef = doc(db, 'rooms', roomCode);
    const roomSnap = await getDoc(roomRef);

    if (!roomSnap.exists()) {
      setError('Room not found. Check the code again.');
      return;
    }

    const roomData = roomSnap.data();

    // Optional: check if user already joined
    const alreadyJoined = roomData.players.some(p => p.uid === user.uid);
    if (alreadyJoined) {
      navigate(`/room/${roomCode}`);
      return;
    }

    // Add current user to the players array
    await updateDoc(roomRef, {
      players: arrayUnion({
        name: user.name,
        uid: user.uid,
        score: 0,
      })
    });

    navigate(`/room/${roomCode}`);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Join a Battle Room</h2>
      <input
        type="text"
        placeholder="Enter Room Code"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
        style={{ padding: '10px', margin: '10px', width: '200px' }}
      />
      <br />
      <button onClick={handleJoin}>Join Room</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default JoinRoom;
