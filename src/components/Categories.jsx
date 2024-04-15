import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useOutletContext } from 'react-router-dom';
import axios from 'axios';

const Categories = () => {
  const { categories, fetchCategories } = useOutletContext();
  const [newCategory, setNewCategory] = useState('');
  const userId = localStorage.getItem('userId');
  const navigateTo = useNavigate();

  const addCategory = async () => {
    try {
      await axios.post(
        `http://localhost:3000/category/${userId}/${newCategory}`,
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

  const deleteCategory = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/category/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      toast.success('Category deleted');
      fetchCategories();
    } catch (error) {
      toast.error('Error deleting category');
      console.error('Error deleting category:', error);
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
            <h1 className='text-4xl font-bold'>Categories</h1>
            <div className='flex-row mt-2'>
              <input
                type='text'
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder='New Category'
                className='mr-2 p-2 rounded border border-gray-400 focus:outline-none focus:border-blue-500'
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
          <h2 className='text-4xl text-gray-200 font-semibold mb-2'>
            Category List
          </h2>
          {categories.length === 0 && (
            <p className='text-gray-200'>No categories found</p>
          )}

          <ul>
            {categories.map((category) => (
              <li key={category.id} className='flex-row items-center'>
                <span className='text-gray-200 text-2xl mx-3'>
                  {category.category}
                </span>
                <button
                  onClick={() => deleteCategory(category.id)}
                  className='font-bold hover:text-red-500'
                >
                  x
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Categories;
