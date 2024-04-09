import { useState } from 'react';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    try {
      const response = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, confirmPassword }),
      });
      if (response.status === 400) {
        setError('User already exists');
      } else if (response.status === 401) {
        setError('Passwords do not match');
      } else {
        window.location.href = '/';
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <input
        type='text'
        placeholder='Username'
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type='password'
        placeholder='Password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type='password'
        placeholder='Confirm Password'
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button onClick={handleRegister}>Register</button>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Register;
