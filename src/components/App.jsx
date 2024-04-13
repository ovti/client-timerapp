import { useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Outlet, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Nav from './Nav';
import Home from './Home';

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
    toast.success('Logout successful');
    navigateTo('/');
  };

  useEffect(() => {
    handleLogin();
  }, [handleLogin]);

  return (
    <>
      <Nav
        loggedIn={loggedIn}
        onLogout={handleLogout}
        handleLogin={handleLogin}
      />
      <ToastContainer
        autoClose={2000}
        limit={3}
        draggable
        draggablePercent={60}
        closeButton={true}
        position='top-right'
      />
      {!loggedIn && (
        <div className='flex items-center justify-center mb-3'>
          <div className='grid grid-cols-1 gap-6'>
            <h1 className='text-9xl font-bold text-center'>Timer App</h1>
            <p className='text-center text-4xl'>
              Please login or register to continue
            </p>
          </div>
        </div>
      )}
      <Outlet
        context={{
          loggedIn,
          id,
          nickname,
          handleLogin,
        }}
      />
      {loggedIn && <Home id={id} />}
    </>
  );
}

export default App;
