import { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { toast } from 'react-toastify';

const Task = ({
  userId,
  userCategories,
  userTasks,
  fetchTasks,
  selectedTask,
  setSelectedTask,
  creatingTask,
  setCreatingTask,
}) => {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sessionsToComplete, setSessionsToComplete] = useState(1);

  const addTask = async () => {
    try {
      await axios.post(
        `http://localhost:3000/task/${userId}/${selectedCategory}/${title}/${description}/${sessionsToComplete}/`,
        null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      toast.success('Task added');
      setCreatingTask(false);
      setSelectedTask(0);
      fetchTasks();
    } catch (error) {
      toast.error('Error saving task');
      console.error('Error saving category:', error);
    }
  };

  return (
    <div className='w-1/4 mx-auto my-2'>
      {creatingTask ? (
        <div className='bg-gray-900 p-4 rounded-lg'>
          <button
            onClick={() => setCreatingTask(false)}
            className='float-right text-white font-bold bg-red-500 p-2 rounded hover:bg-red-600'
            style={{ width: '2.5rem', height: '2.5rem' }}
          >
            x
          </button>
          <h2 className='text-4xl text-white font-semibold mb-4'>
            Create Task
          </h2>
          <p className='text-gray-200'>Title</p>
          <input
            id='title'
            className='bg-gray-800 text-white py-2 px-4 rounded mt-2 w-full'
            type='text'
            placeholder='Title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <p className='text-gray-200 mt-2'>Category</p>
          <select
            id='categorySelect'
            className='bg-gray-800 text-white py-2 px-4 rounded mt-4 w-full'
            type='text'
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(Number(e.target.value))}
          >
            <option value='default'>Select category for this session</option>
            {userCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.category}
              </option>
            ))}
          </select>
          <p className='text-gray-200 mt-2'>Description</p>
          <textarea
            id='description'
            className='bg-gray-800 text-white py-2 px-4 rounded mt-2 w-full'
            placeholder='Description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <p className='text-gray-200 mt-2'>Sessions needed to complete task</p>
          <input
            id='sessionsNeeded'
            className='bg-gray-800 text-white py-2 px-4 rounded mt-2 w-full'
            type='number'
            placeholder='Sessions needed'
            value={sessionsToComplete}
            onChange={(e) => setSessionsToComplete(Number(e.target.value))}
          />
          <button
            id='createTaskButton'
            className='bg-blue-500 text-white py-2 px-4 rounded mt-4 hover:bg-blue-600'
            onClick={addTask}
          >
            Create Task
          </button>
        </div>
      ) : (
        selectedTask !== 0 && (
          <div className='bg-gray-800 p-4'>
            <button
              onClick={() => setSelectedTask(0)}
              className='float-right text-white font-bold bg-red-500 p-2 rounded hover:bg-red-600'
              style={{ width: '2.5rem', height: '2.5rem' }}
            >
              x
            </button>
            <h2 className='text-xl text-gray-200 font-semibold mb-2'>
              Current Task
            </h2>
            <p className='text-gray-200 text-m'>
              Task: {userTasks.find((task) => task.id === selectedTask).title}
            </p>
            <p className='text-gray-200 text-m'>
              Category:{' '}
              {
                userTasks.find((task) => task.id === selectedTask).Category
                  .category
              }
            </p>
            <p className='text-gray-200 text-m'>
              Description:{' '}
              {userTasks.find((task) => task.id === selectedTask).description}
            </p>
            <p className='text-gray-200 text-m'>
              Sessions to complete:{' '}
              {userTasks.find((task) => task.id === selectedTask).sessionCount}/
              {
                userTasks.find((task) => task.id === selectedTask)
                  .sessionsToComplete
              }
            </p>
          </div>
        )
      )}
    </div>
  );
};

Task.propTypes = {
  userId: PropTypes.number.isRequired,
  userCategories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      category: PropTypes.string,
    })
  ).isRequired,
  fetchTasks: PropTypes.func.isRequired,
  userTasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
      description: PropTypes.string,
      sessionCount: PropTypes.number,
      sessionsToComplete: PropTypes.number,
      Category: PropTypes.shape({
        id: PropTypes.number,
        category: PropTypes.string,
      }),
    })
  ).isRequired,
  selectedTask: PropTypes.number.isRequired,
  setSelectedTask: PropTypes.func.isRequired,
  creatingTask: PropTypes.bool.isRequired,
  setCreatingTask: PropTypes.func.isRequired,
};

export default Task;
