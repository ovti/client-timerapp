import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './App.css';
import Register from './components/Register';
import Login from './components/Login';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [nickname, setNickname] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('nickname');
    setLoggedIn(false);
  };

  const checkLoggedIn = useCallback(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 < Date.now()) {
        handleLogout();
      } else {
        setLoggedIn(true);
        setNickname(decodedToken.user.username);
      }
    }
  }, []);

  const ApiCall = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/');
      console.log(response);
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        handleLogout(); // Unauthorized or expired token, logout user
      }
    }
  };

  const testAuth = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        'http://localhost:3000/api/posts',
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Authorization successful:', response.data);
    } catch (error) {
      console.error('Authorization failed:', error);
      if (error.response && error.response.status === 401) {
        handleLogout();
      }
    }
  };

  useEffect(() => {
    checkLoggedIn();
  }, [checkLoggedIn]);

  return (
    <>
      <h1>Timer App</h1>
      <div className='card'>
        <button onClick={ApiCall}>Call API</button>
        <button onClick={testAuth}>Test Auth</button>
        {loggedIn ? (
          <div>
            <h2>Welcome, {nickname}!</h2>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <>
            <div>
              <Login onLogin={() => checkLoggedIn()} />
            </div>
            <div>
              <Register />
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;
