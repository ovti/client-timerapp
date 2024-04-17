import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { toast } from "react-toastify";
import Categories from "./Categories";

const Task = ({
  userId,
  userCategories,
  fetchCategories,
  userTasks,
  fetchTasks,
  selectedTask,
  setSelectedTask,
  creatingTask,
  setCreatingTask,
}) => {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sessionsToComplete, setSessionsToComplete] = useState(1);
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const addTask = async () => {
    try {
      await axios.post(
        `http://localhost:3000/task/${userId}/${selectedCategory}/${title}/${description}/${sessionsToComplete}/`,
        null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      toast.success("Task added");
      setCreatingTask(false);
      setSelectedTask(0);
      setTitle("");
      setDescription("");
      setSessionsToComplete(1);
      setSelectedCategory(0);
      fetchTasks();
    } catch (error) {
      toast.error("Error saving task");
      console.error("Error saving category:", error);
    }
  };

  return (
    <div
      className={`m-2 md:mx-auto md:w-10/12 lg:mx-auto lg:mt-8 lg:w-1/4 ${loaded ? "pop-in" : ""}`}
    >
      {creatingTask ? (
        <div className="rounded-lg bg-gray-900 p-4">
          <button
            onClick={() => setCreatingTask(false)}
            className="float-right rounded bg-red-500 p-2 font-bold text-white hover:bg-red-600"
            style={{ width: "2.5rem", height: "2.5rem" }}
          >
            x
          </button>
          <h2 className="mb-4 text-4xl font-semibold text-white">
            Create Task
          </h2>
          <p className="text-gray-200">Title</p>
          <input
            id="title"
            className="mt-2 w-full rounded bg-gray-800 px-4 py-2 text-white"
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <p className="mt-2 text-gray-200">Category</p>
          <div className="flex-row items-center justify-between">
            <select
              id="categorySelect"
              className="mr-2 mt-4 rounded bg-gray-800 px-4 py-2 text-white"
              type="text"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(Number(e.target.value))}
            >
              <option value="0">Select category for this session</option>
              {userCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.category}
                </option>
              ))}
            </select>
            <button
              className="mt-2 rounded bg-blue-500 px-3 py-1 font-bold text-white hover:bg-blue-600"
              onClick={() => setCreatingCategory(true)}
            >
              +
            </button>
          </div>
          {creatingCategory && (
            <Categories
              setCreatingCategory={setCreatingCategory}
              categories={userCategories}
              fetchCategories={fetchCategories}
            />
          )}
          <p className="mt-2 text-gray-200">Description</p>
          <textarea
            id="description"
            maxLength="64"
            className="mt-2 w-full resize-none rounded bg-gray-800 px-4 py-2 text-white"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <p className="mt-2 text-gray-200">Sessions needed to complete task</p>
          <input
            id="sessionsNeeded"
            className="mt-2 w-full rounded bg-gray-800 px-4 py-2 text-white"
            type="number"
            placeholder="Sessions needed"
            value={sessionsToComplete}
            onChange={(e) => setSessionsToComplete(Number(e.target.value))}
          />
          <button
            id="createTaskButton"
            className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            onClick={addTask}
          >
            Create Task
          </button>
        </div>
      ) : (
        selectedTask !== 0 && (
          <div className="bg-gray-800 p-4">
            <button
              onClick={() => setSelectedTask(0)}
              className="float-right rounded bg-red-500 p-2 font-bold text-white hover:bg-red-600"
              style={{ width: "2.5rem", height: "2.5rem" }}
            >
              x
            </button>
            <h2 className="mb-2 text-xl font-semibold text-gray-200">
              Current Task
            </h2>
            <p className="text-m text-gray-200">
              Task: {userTasks.find((task) => task.id === selectedTask).title}
            </p>
            <p className="text-m text-gray-200">
              Category:{" "}
              {
                userTasks.find((task) => task.id === selectedTask).Category
                  .category
              }
            </p>
            <p className="text-m text-gray-200">
              Description:{" "}
              {userTasks.find((task) => task.id === selectedTask).description}
            </p>
            <p className="text-m text-gray-200">
              Sessions to complete:{" "}
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
    }),
  ).isRequired,
  fetchTasks: PropTypes.func.isRequired,
  fetchCategories: PropTypes.func.isRequired,
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
    }),
  ).isRequired,
  selectedTask: PropTypes.number.isRequired,
  setSelectedTask: PropTypes.func.isRequired,
  creatingTask: PropTypes.bool.isRequired,
  setCreatingTask: PropTypes.func.isRequired,
};

export default Task;
