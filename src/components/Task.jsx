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
  const [description, setDescription] = useState("None");
  const [sessionsToComplete, setSessionsToComplete] = useState(1);
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const API_URL = import.meta.env.VITE_BASE_API_URL;

  useEffect(() => {
    setLoaded(true);
  }, []);

  const addTask = async () => {
    try {
      await axios.post(
        `${API_URL}/task/${userId}/${selectedCategory}/${title}/${description}/${sessionsToComplete}/`,
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
      setDescription("None");
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
      className={`m-2 rounded border border-fire-brick md:mx-auto md:w-10/12 lg:mx-auto lg:mt-2 lg:w-1/4 ${loaded ? "pop-in" : ""}`}
    >
      {creatingTask ? (
        <div className="rounded-lg  p-4">
          <button
            onClick={() => setCreatingTask(false)}
            className="float-right rounded bg-fire-brick p-2 font-bold hover:bg-red-600  hover:text-white"
            style={{ width: "2.5rem", height: "2.5rem" }}
          >
            x
          </button>
          <h2 className="mb-4 text-4xl font-semibold ">Create Task</h2>
          <p className="">Title</p>
          <input
            id="title"
            className="mt-2 w-full rounded  px-4 py-2 "
            type="text"
            placeholder="Title"
            maxLength="32"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <p className="mt-2 ">Category</p>
          <div className="flex-row items-center justify-between">
            <select
              id="categorySelect"
              className="mr-2 mt-4 rounded px-2 py-2 lg:w-3/4 "
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
              className="mt-2 rounded bg-fire-brick px-3 py-1 font-bold hover:bg-red-600  hover:text-white"
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
          <p className="mt-2 ">Description</p>
          <textarea
            id="description"
            maxLength="64"
            className="mt-2 w-full resize-none rounded  px-4 py-2 "
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <p className="mt-2 ">Sessions needed to complete task (1-99)</p>
          <input
            id="sessionsNeeded"
            className="mt-2 w-full rounded px-4 py-2 "
            type="number"
            placeholder="Sessions needed"
            maxLength="2"
            min="1"
            onChange={(e) => setSessionsToComplete(Number(e.target.value))}
          />
          <button
            id="createTaskButton"
            className="mt-2 rounded bg-fire-brick p-2 font-semibold text-white hover:bg-red-600 lg:mr-2 lg:px-4 lg:py-2"
            onClick={addTask}
          >
            Create Task
          </button>
        </div>
      ) : (
        selectedTask !== 0 && (
          <div className="rounded-lg  ">
            <div className="w-full bg-red-500 p-4 ">
              <button
                onClick={() => setSelectedTask(0)}
                className="float-right rounded bg-fire-brick p-2 font-bold hover:bg-red-600  hover:text-white"
                style={{ width: "2.5rem", height: "2.5rem" }}
              >
                x
              </button>
              <h2 className="mb-2 text-2xl font-semibold text-white">
                Current Task
              </h2>
            </div>
            <div className="p-4">
              <p className="text-xl">
                <b>Task:</b>{" "}
                {userTasks.find((task) => task.id === selectedTask)?.title ||
                  "N/A"}
              </p>{" "}
              <p className="text-xl">
                <b>Category:</b>{" "}
                {userTasks.find((task) => task.id === selectedTask)?.Category
                  .category || "N/A"}
              </p>
              <p className="text-xl">
                <b>Description:</b>{" "}
                {userTasks.find((task) => task.id === selectedTask)
                  ?.description || "N/A"}
              </p>
              <p className="text-xl">
                <b>Sessions to complete:</b>{" "}
                {userTasks.find((task) => task.id === selectedTask)
                  ?.sessionCount || "0"}{" "}
                /{" "}
                {userTasks.find((task) => task.id === selectedTask)
                  ?.sessionsToComplete || "0"}
              </p>
            </div>
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
