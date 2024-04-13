import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/getCategories/${localStorage.getItem('userId')}`,
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
  };

  const addCategory = async () => {
    try {
      await axios.post(
        `http://localhost:3000/saveCategory/${localStorage.getItem(
          'userId'
        )}/${newCategory}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      toast.success('Category added');
      fetchCategories();
      setNewCategory('');
    } catch (error) {
      toast.error('Error saving category');
      console.error('Error saving category:', error);
    }
  };

  return (
    <>
      <div className='w-1/2 mx-auto mt-8'>
        <div className='bg-gray-900 p-4 rounded-t-lg'>
          <div className='flex-column items-center justify-between mb-4 p-4'>
            <h1 className='text-4xl font-bold'>Categories</h1>
            <div className='flex'>
              <input
                type='text'
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder='New Category'
                className='mr-2 px-2 py-1 rounded border border-gray-400 focus:outline-none focus:border-blue-500'
              />
              <button
                className='text-white bg-blue-500 p-2 rounded mt-4'
                onClick={addCategory}
              >
                Add Category
              </button>
            </div>
          </div>
        </div>
        <div className='bg-gray-800 p-4'>
          <h2 className='text-xl text-gray-200 font-semibold mb-2'>
            Category List
          </h2>
          <ul>
            {categories.map((category) => (
              <li key={category.id} className='text-gray-200'>
                {category.category}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Categories;
