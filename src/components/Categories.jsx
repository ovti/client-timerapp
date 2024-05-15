import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import axios from "axios";

const Categories = ({ setCreatingCategory, categories, fetchCategories }) => {
  const [newCategory, setNewCategory] = useState("");
  const userId = localStorage.getItem("userId");
  const [loaded, setLoaded] = useState(false);

  const API_URL = import.meta.env.VITE_BASE_API_URL;

  useEffect(() => {
    setLoaded(true);
  }, []);

  const addCategory = async () => {
    try {
      await axios.post(`${API_URL}/category/${userId}/${newCategory}`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Category added");
      setCreatingCategory(false);
      fetchCategories();
      setNewCategory("");
    } catch (error) {
      toast.error("Error saving category");
      console.error("Error saving category:", error);
    }
  };

  const deleteCategory = async (id) => {
    try {
      await axios.delete(`${API_URL}/category/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Category deleted");
      fetchCategories();
    } catch (error) {
      toast.error("Error deleting category");
      console.error("Error deleting category:", error);
    }
  };

  return (
    <div
      className={`0 m-4 mx-auto rounded-lg border-2 border-fire-brick p-4 ${loaded ? "pop-in" : ""}`}
    >
      <button
        onClick={() => setCreatingCategory(false)}
        className="float-right rounded bg-fire-brick p-2 font-bold hover:bg-red-600 hover:text-white"
        style={{ width: "2.5rem", height: "2.5rem" }}
      >
        x
      </button>
      <div className="">
        <div className="flex-column items-center justify-between px-4">
          <h1 className="text-4xl font-bold">Categories</h1>
          <div className="mt-2 flex-row">
            <input
              type="text"
              value={newCategory}
              minLength="3"
              maxLength="16"
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New Category"
              className="mr-2 rounded border  p-2  focus:outline-none"
            />
            <button
              className="mt-4 rounded bg-fire-brick px-4 py-2 font-bold  hover:bg-red-600  hover:text-white"
              onClick={addCategory}
            >
              +
            </button>
          </div>
        </div>
      </div>
      <div className="px-4 py-2">
        <h2 className="mb-2 text-xl font-semibold ">Your categories</h2>
        {categories.length === 0 && <p className="">No categories found</p>}

        <ul>
          {categories.map((category) => (
            <li key={category.id} className="flex-row items-center">
              <span className="mx-3 text-lg ">{category.category}</span>
              <button
                onClick={() => deleteCategory(category.id)}
                className="text-lg font-bold hover:text-red-500"
              >
                x
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

Categories.propTypes = {
  setCreatingCategory: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(PropTypes.object).isRequired,
  fetchCategories: PropTypes.func.isRequired,
};

export default Categories;
