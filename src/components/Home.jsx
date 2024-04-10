import { useState, useEffect } from 'react';
import Timer from './Timer';
import { jwtDecode } from 'jwt-decode';

const Home = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [id, setId] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 > Date.now()) {
        setLoggedIn(true);
        setId(decodedToken.user.id);
      }
    }
  }, []);

  return (
    <>
      {loggedIn && <Timer id={id} />}
      {/* Add any other content for the home page here */}
    </>
  );
};

export default Home;
