import { useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import Register from './Register';
import Login from './Login';
import TestAuth from './TestAuth';
import Timer from './Timer';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [id, setId] = useState('');
  const [nickname, setNickname] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
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
        setId(decodedToken.user.id);
        setNickname(decodedToken.user.username);
      }
    }
  }, []);

  useEffect(() => {
    checkLoggedIn();
  }, [checkLoggedIn]);

  return (
    <>
      <div className='container'>
        <h1>Timer App</h1>
        <TestAuth />
        <div className='card'>
          {loggedIn ? (
            <div>
              <h2>
                Welcome, {nickname}! Your id is {id}.
              </h2>
              <button onClick={handleLogout}>Logout</button>
              <Timer />
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
      </div>
    </>
  );
}

export default App;
