import { useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Outlet, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import Nav from './Nav';
import Home from './Home';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [id, setId] = useState('');
  const [nickname, setNickname] = useState('');
  const [categories, setCategories] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [tasks, setTasks] = useState([]);
  const userId = localStorage.getItem('userId');
  const navigateTo = useNavigate();

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/category/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, [userId]);

  const fetchSessions = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/sessions/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setSessions(response.data);
      console.log('Sessions:', response.data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  }, [userId]);

  const fetchTasks = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/tasks/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }, [userId]);

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
    fetchCategories();
    fetchSessions();
    fetchTasks();
  }, [handleLogin, fetchCategories, fetchSessions, fetchTasks]);

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
          categories,
          fetchCategories,
          sessions,
          fetchSessions,
          tasks,
          fetchTasks,
        }}
      />
      {loggedIn && (
        <Home
          id={id}
          categories={categories}
          tasks={tasks}
          fetchSessions={fetchSessions}
        />
      )}
    </>
  );
}

export default App;
