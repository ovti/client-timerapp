import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const CompletedTasks = () => {
  const { tasks, fetchTasks } = useOutletContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage] = useState(5);
  const [sortDirection, setSortDirection] = useState("asc");
  const [sortBy, setSortBy] = useState("title");
  const navigateTo = useNavigate();

  const API_URL = import.meta.env.VITE_BASE_API_URL;
  const PATH_URL = import.meta.env.VITE_BASE_PATH_URL;

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/task/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Task deleted");
      fetchTasks();
    } catch (error) {
      toast.error("Error deleting task");
      console.error("Error deleting task:", error);
    }
  };

  const completedTasks = tasks.filter((task) => task.status === "completed");

  const sortedTasks = completedTasks.sort((a, b) => {
    const compareValue = (a, b) => {
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    };

    const sortOrder = sortDirection === "asc" ? 1 : -1;

    if (sortBy === "title") {
      return compareValue(a.title, b.title) * sortOrder;
    } else if (sortBy === "description") {
      return compareValue(a.description, b.description) * sortOrder;
    } else if (sortBy === "sessionsToComplete") {
      return (a.sessionsToComplete - b.sessionsToComplete) * sortOrder;
    }

    return 0;
  });

  const totalPages = Math.ceil(sortedTasks.length / tasksPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber < 1) {
      setCurrentPage(1);
    } else if (pageNumber > totalPages) {
      setCurrentPage(totalPages);
    } else {
      setCurrentPage(pageNumber);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <li key={i}>
          <button
            onClick={() => paginate(i)}
            className={`mx-1 my-2 rounded bg-red-500 px-4 py-2 text-white ${currentPage === i ? "bg-gray-800" : ""}`}
          >
            {i}
          </button>
        </li>,
      );
    }

    return pageNumbers;
  };

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = sortedTasks.slice(indexOfFirstTask, indexOfLastTask);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  };

  return (
    <>
      <div className="m-2 rounded border border-fire-brick md:mx-auto md:w-10/12 lg:mx-auto lg:mt-8 lg:w-5/12">
        <div className="bg-red-500 p-4">
          <button
            onClick={() => navigateTo(PATH_URL + "/")}
            className="float-right rounded bg-fire-brick p-2 font-bold  hover:bg-red-600 hover:text-white"
            style={{ width: "2.5rem", height: "2.5rem" }}
          >
            x
          </button>
          <div className="flex-column mb-4 items-center justify-between p-4">
            <h1 className="text-4xl font-bold text-white">Completed Tasks</h1>
          </div>
        </div>
        {completedTasks.length === 0 && (
          <div className="p-4">
            <h2 className="text-center">You have no completed tasks yet!</h2>
          </div>
        )}
        {completedTasks.length !== 0 && (
          <div className="flex-col items-center justify-center overflow-x-auto sm:p-4 md:flex">
            <table className="w-3/4 table-auto">
              <thead>
                <tr>
                  <th
                    className="cursor-pointer p-2 text-center"
                    onClick={() => handleSort("title")}
                  >
                    Title
                  </th>
                  <th
                    className="cursor-pointer truncate p-2 text-center"
                    onClick={() => handleSort("description")}
                  >
                    Description
                  </th>
                  <th
                    className="cursor-pointer p-2 text-center"
                    onClick={() => handleSort("sessionsToComplete")}
                  >
                    Sessions to Complete
                  </th>
                  <th className="p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentTasks.map((task) => (
                  <tr key={task.id}>
                    <td className="p-1 text-center">{task.title}</td>
                    <td
                      className="p-1 text-center md:text-left"
                      style={{ maxWidth: "200px" }}
                    >
                      <div className="overflow-hidden md:overflow-visible">
                        <div className="hidden text-center md:block">
                          {task.description}
                        </div>
                        <div className="block truncate md:hidden">
                          {task.description}
                        </div>
                      </div>
                    </td>

                    <td className="p-1 text-center">
                      {task.sessionsToComplete}
                    </td>
                    <td className="p-1 text-center">
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="rounded bg-red-500 px-3 py-1 text-white"
                      >
                        X
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ul className="flex justify-center">{renderPageNumbers()}</ul>
          </div>
        )}
      </div>
    </>
  );
};

export default CompletedTasks;
