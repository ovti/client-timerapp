import { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const Task = ({ userId, userCategories }) => {
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
    } catch (error) {
      toast.error('Error saving task');
      console.error('Error saving category:', error);
    }
  };

  return (
    <div className='w-1/4 mx-auto mt-8'>
      <div className='bg-gray-900 p-4 rounded-lg'>
        <h2 className='text-4xl text-white font-semibold mb-4'>Create Task</h2>
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
};

export default Task;
