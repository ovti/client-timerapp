import { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/login', {
        username,
        password,
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('nickname', response.data.nickname);
      console.log('Login successful:', response.data);
      onLogin(); // Inform the parent component about successful login
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
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
        <button type='submit'>Login</button>
      </form>
    </>
  );
};

Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default Login;
