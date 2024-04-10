import { useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Outlet, useNavigate } from 'react-router-dom';
import Nav from './Nav';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [id, setId] = useState('');
  const [nickname, setNickname] = useState('');
  const navigateTo = useNavigate();

  const handleLogin = useCallback(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 > Date.now()) {
        setLoggedIn(true);
        setId(decodedToken.user.id);
        setNickname(decodedToken.user.username);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('nickname');
    setLoggedIn(false);
    navigateTo('/');
  };

  useEffect(() => {
    handleLogin();
  }, [handleLogin]);

  return (
    <>
      <Nav loggedIn={loggedIn} onLogout={handleLogout} />
      <Outlet loggedIn={loggedIn} id={id} nickname={nickname} />
    </>
  );
}

export default App;
