import { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        'http://wierzba.wzks.uj.edu.pl:12122/signup',
        {
          username,
          password,
          confirmPassword,
        }
      );
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
    <div className='flex items-center justify-center'>
      <div className='grid grid-cols-1 gap-6'>
        <h1 className='text-4xl font-bold text-center'>Register</h1>
        <input
          type='text'
          placeholder='Username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className='p-2 border border-gray-300 rounded'
        />
        <input
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='p-2 border border-gray-300 rounded'
        />
        <input
          type='password'
          placeholder='Confirm Password'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className='p-2 border border-gray-300 rounded'
        />
        <button
          onClick={handleSubmit}
          className='p-2 bg-blue-500 text-white rounded'
        >
          Register
        </button>
        {error && <p className='text-red-500'>{error}</p>}
      </div>
    </div>
  );
};

export default Register;
