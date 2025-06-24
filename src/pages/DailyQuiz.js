import React, { useState, useEffect } from 'react';

const sampleQuestions = [
  {
    question: 'What does HTML stand for?',
    options: ['HyperText Markup Language', 'HighText Machine Language', 'HyperTabular Mark Language', 'None of these'],
    correct: 0,
  },
  {
    question: 'Which language is used for styling web pages?',
    options: ['HTML', 'JQuery', 'CSS', 'XML'],
    correct: 2,
  },
  {
    question: 'Which is not a JavaScript Framework?',
    options: ['Python Script', 'JQuery', 'Django', 'NodeJS'],
    correct: 2,
  },
];

const DailyQuiz = () => {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    // Load XP and streak from localStorage
    const storedXp = parseInt(localStorage.getItem('xp')) || 0;
    const storedStreak = parseInt(localStorage.getItem('streak')) || 0;
    const lastPlayed = localStorage.getItem('lastPlayed');

    const today = new Date().toDateString();
    if (lastPlayed !== today) {
      if (lastPlayed === new Date(Date.now() - 86400000).toDateString()) {
        setStreak(storedStreak + 1); // continued streak
        localStorage.setItem('streak', storedStreak + 1);
      } else {
        setStreak(1); // reset streak
        localStorage.setItem('streak', 1);
      }
      localStorage.setItem('lastPlayed', today);
    } else {
      setStreak(storedStreak);
    }

    setXp(storedXp);
  }, []);

  const handleOptionClick = (index) => {
    setSelected(index);
    let gainedXp = xp;

    if (index === sampleQuestions[current].correct) {
      setScore(score + 1);
      gainedXp += 10;
      setXp(gainedXp);
      localStorage.setItem('xp', gainedXp);
    }

    setTimeout(() => {
      if (current + 1 < sampleQuestions.length) {
        setCurrent(current + 1);
        setSelected(null);
      } else {
        setShowResult(true);
      }
    }, 800);
  };

  if (showResult) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>🎉 Quiz Finished!</h2>
        <p>Your Score: {score} / {sampleQuestions.length}</p>
        <p>🧠 Total XP: {xp}</p>
        <p>🔥 Current Streak: {streak} day(s)</p>
      </div>
    );
  }

  const currentQ = sampleQuestions[current];

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Question {current + 1} of {sampleQuestions.length}</h2>
      <p>{currentQ.question}</p>

      <div>
        {currentQ.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(index)}
            style={{
              display: 'block',
              margin: '10px 0',
              padding: '10px',
              width: '100%',
              backgroundColor:
                selected === null
                  ? '#f0f0f0'
                  : index === currentQ.correct
                  ? 'lightgreen'
                  : index === selected
                  ? '#ff6961'
                  : '#f0f0f0',
              border: '1px solid #ccc',
              borderRadius: '8px',
              cursor: selected === null ? 'pointer' : 'default',
            }}
            disabled={selected !== null}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DailyQuiz;
