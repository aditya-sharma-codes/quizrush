import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase-config';

const sampleQuestions = [
  { question: 'What is the capital of France?', options: ['Berlin', 'Paris', 'Madrid', 'Lisbon'], correct: 1 },
  { question: 'What is 5 + 3?', options: ['6', '7', '8', '9'], correct: 2 },
  { question: 'Largest mammal?', options: ['Elephant', 'Whale', 'Hippo', 'Giraffe'], correct: 1 },
];

const RoomArena = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [allFinished, setAllFinished] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);

    const roomRef = doc(db, 'rooms', code);
    const unsubscribe = onSnapshot(roomRef, (snapshot) => {
      const data = snapshot.data();
      if (!data) return;

      setRoomData(data);
      if (data.status === 'started') {
        setQuizStarted(true);
      }

      // Check if all players have finished
      const allDone = data.players.every(p => p.status === 'finished');
      setAllFinished(allDone);

      setLoading(false);
    });

    return () => unsubscribe();
  }, [code]);

  const startQuiz = async () => {
    await updateDoc(doc(db, 'rooms', code), {
      status: 'started',
    });
  };

  const markPlayerFinished = async (finalScore) => {
    const roomRef = doc(db, 'rooms', code);
    const snapshot = await getDoc(roomRef);
    const data = snapshot.data();

    const updatedPlayers = data.players.map(p =>
      p.uid === user.uid ? { ...p, score: finalScore, status: 'finished' } : p
    );

    await updateDoc(roomRef, { players: updatedPlayers });
  };

  const handleAnswer = async (index) => {
    setSelected(index);
    const isCorrect = index === sampleQuestions[currentQ].correct;
    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);

    setTimeout(async () => {
      if (currentQ + 1 < sampleQuestions.length) {
        setCurrentQ(currentQ + 1);
        setSelected(null);
      } else {
        setFinished(true);
        await markPlayerFinished(newScore);
      }
    }, 1000);
  };

  const handlePlayAgain = () => {
    navigate('/');
  };

  if (loading || !roomData) return <p>Loading room...</p>;

  if (!quizStarted) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Room Code: {code}</h2>
        <h3>Players Joined:</h3>
        <ul style={{ listStyle: 'none' }}>
          {roomData.players.map((p, i) => (
            <li key={i} style={{ margin: '10px' }}>
              <img src={p.photo} alt="avatar" style={{ width: 30, borderRadius: '50%', marginRight: 8 }} />
              {p.name}
            </li>
          ))}
        </ul>
        {roomData.host.uid === user.uid ? (
          <button onClick={startQuiz} style={{ marginTop: '20px', padding: '10px 20px' }}>
            🚀 Start Battle
          </button>
        ) : (
          <p>Waiting for host to start the battle...</p>
        )}
      </div>
    );
  }

  if (finished && allFinished) {
    const sortedPlayers = [...roomData.players].sort((a, b) => b.score - a.score);

    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>🏆 Battle Result</h2>
        <table style={{ margin: 'auto', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr>
              <th>#</th>
              <th>Player</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {sortedPlayers.map((player, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #ccc' }}>
                <td><b>{i + 1}</b></td>
                <td>
                  <img src={player.photo} alt="avatar" style={{ width: 30, borderRadius: '50%', marginRight: 8 }} />
                  {player.name}
                </td>
                <td>{player.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={handlePlayAgain} style={{ marginTop: '20px', padding: '10px 20px' }}>
          🔁 Play Again
        </button>
      </div>
    );
  }

  const currentQuestion = sampleQuestions[currentQ];

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Battle in Progress ⚔️</h2>
      {!finished ? (
        <>
          <h3>Q{currentQ + 1}: {currentQuestion.question}</h3>
          {currentQuestion.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              style={{
                display: 'block',
                margin: '10px 0',
                padding: '10px',
                backgroundColor:
                  selected === null ? '#eee'
                    : i === currentQuestion.correct ? 'lightgreen'
                    : i === selected ? '#ff6961'
                    : '#eee',
                borderRadius: '8px',
              }}
              disabled={selected !== null}
            >
              {opt}
            </button>
          ))}
        </>
      ) : (
        <p>Waiting for other players to finish...</p>
      )}
    </div>
  );
};

export default RoomArena;
