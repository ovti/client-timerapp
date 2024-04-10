import axios from 'axios';

function TestAuth() {
  const ApiCall = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/');
      console.log(response);
    } catch (error) {
      console.error(error);
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
    }
  };

  return (
    <>
      <button onClick={ApiCall}>Test API</button>
      <button onClick={testAuth}>Test Auth</button>
    </>
  );
}

export default TestAuth;
