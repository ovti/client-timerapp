import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigateTo = useNavigate();
  const handleLogin = useOutletContext().handleLogin;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/login', {
        username,
        password,
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.userId);
      localStorage.setItem('nickname', response.data.nickname);
      console.log('Login successful:', response.data);
      handleLogin();
      navigateTo('/');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className='flex items-center justify-center'>
      <div className='grid grid-cols-1 gap-6'>
        <h1 className='text-4xl font-bold text-center'>Login</h1>
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
        <button
          onClick={handleSubmit}
          className='p-2 bg-blue-500 text-white rounded'
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
