import React from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase-config';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        localStorage.setItem('user', JSON.stringify({
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
          uid: user.uid
        }));
        navigate('/'); // go to landing page
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Login to QuizRush</h2>
      <button onClick={handleLogin}>Login with Google</button>
    </div>
  );
};

export default Login;
