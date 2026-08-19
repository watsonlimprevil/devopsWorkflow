// src/pages/Signup.jsx
import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
export default function Signup() {
  const { signup } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const nav = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const data = await signup(email, password);
    if (data.error) setError(data.error);
    nav('/login')
  };

  return (
    <div className="auth-container">
      <h1>Create Account</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Sign Up</button>
      </form>

      <p>
        Already have an account?{' '}
        <span
          style={{ color: 'cyan', cursor: 'pointer' }}
          onClick={() => (window.location.href = '/login')}
        >
          Log in
        </span>
      </p>
    </div>
  );
}
