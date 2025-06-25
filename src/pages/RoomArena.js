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

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);

    const roomRef = doc(db, 'rooms', code);
    const unsubscribe = onSnapshot(roomRef, (snapshot) => {
      const data = snapshot.data();

      if (!data) {
        console.warn("Room data not yet available");
        setLoading(true);
        return;
      }

      setRoomData(data);
      if (data.status === 'started') {
        setQuizStarted(true);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [code]);

  const startQuiz = async () => {
    await updateDoc(doc(db, 'rooms', code), {
      status: 'started',
    });
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
        const updatedPlayers = roomData.players.map(p =>
          p.uid === user.uid ? { ...p, score: newScore } : p
        );
        await updateDoc(doc(db, 'rooms', code), {
          players: updatedPlayers,
        });
      }
    }, 1000);
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
        <div>
          <h2>🎉 Quiz Finished!</h2>
          <p>Your Score: {score} / {sampleQuestions.length}</p>
        </div>
      )}
    </div>
  );
};

export default RoomArena;
