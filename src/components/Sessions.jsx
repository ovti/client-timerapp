import { useNavigate, useOutletContext } from 'react-router-dom';

const Sessions = () => {
  const { sessions } = useOutletContext();
  const navigateTo = useNavigate();

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
          {sessions.length === 0 && (
            <p className='text-gray-200'>No sessions found</p>
          )}

          <ul>
            {sessions.map((session) => (
              <li key={session.id} className='text-gray-200'>
                {session.Category.category} - {session.timeInSeconds} minutes
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sessions;
