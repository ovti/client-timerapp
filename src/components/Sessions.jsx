import { useNavigate, useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const Sessions = () => {
  const { sessions, fetchSessions, fetchCategories } = useOutletContext();
  const navigateTo = useNavigate();

  const sessionsByCategory = sessions.reduce((acc, session) => {
    if (!acc[session.Category.category]) {
      acc[session.Category.category] = [];
    }
    acc[session.Category.category].push(session);
    return acc;
  }, {});

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const deleteSession = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/session/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      toast.success('Session deleted');
      fetchSessions();
      fetchCategories();
    } catch (error) {
      toast.error('Error deleting session');
      console.error('Error deleting session:', error);
    }
  };

  return (
    <>
      <div className='w-1/4 mx-auto mt-8'>
        <div className='bg-gray-900 p-4 rounded-t-lg'>
          <button
            onClick={() => navigateTo('/')}
            className='float-right text-white font-bold bg-red-500 p-2 rounded hover:bg-red-600'
            style={{ width: '2.5rem', height: '2.5rem' }}
          >
            x
          </button>
          <div className='flex-column items-center justify-between mb-4 p-4'>
            <h1 className='text-4xl font-bold'>Sessions</h1>
          </div>
        </div>
        <div className='bg-gray-800 p-4'>
          <h2 className='text-4xl text-gray-200 font-semibold mb-2'>
            Session List
          </h2>
          {Object.keys(sessionsByCategory).length === 0 && (
            <p className='text-gray-200'>No sessions found</p>
          )}
          {Object.keys(sessionsByCategory).map((category) => (
            <div key={category}>
              <h3 className='text-xl text-gray-300 font-semibold mb-2'>
                {category}
              </h3>
              <ul>
                {sessionsByCategory[category].map((session) => (
                  <li key={session.id} className='text-gray-200'>
                    {formatDateTime(session.createdAt)} session - lasted{' '}
                    {session.timeInSeconds} minutes
                    <button
                      onClick={() => deleteSession(session.id)}
                      className=' text-white font-bold hover:text-red-500'
                      style={{ width: '1.5rem', height: '1.5rem' }}
                    >
                      x
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sessions;
