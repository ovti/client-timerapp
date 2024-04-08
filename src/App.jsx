import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './App.css';

function App() {
  const ApiCall = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/');
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <h1>Timer App</h1>
      <div className='card'>
        <button onClick={ApiCall}>Call API</button>
      </div>
    </>
  );
}

export default App;
