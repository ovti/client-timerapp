import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const Sessions = () => {
  const { sessions, fetchSessions, fetchCategories, fetchTasks } =
    useOutletContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [sessionsPerPage] = useState(5);
  const [sortDirection, setSortDirection] = useState("asc");
  const [sortBy, setSortBy] = useState("category");
  const navigateTo = useNavigate();

  useEffect(() => {
    fetchSessions();
    fetchCategories();
    fetchTasks();
  }, [fetchSessions, fetchCategories, fetchTasks]);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const deleteSession = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/session/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Session deleted");
      fetchTasks();
      fetchSessions();
      fetchCategories();
    } catch (error) {
      toast.error("Error deleting session");
      console.error("Error deleting session:", error);
    }
  };

  const combinedSessions = sessions.map((session) => ({
    ...session,
    category: session.Task.Category.category,
    task: session.Task.title,
  }));

  const sortedSessions = combinedSessions.sort((a, b) => {
    const compareValue = (a, b) => {
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    };

    const sortOrder = sortDirection === "asc" ? 1 : -1;

    if (sortBy === "category") {
      return compareValue(a.category, b.category) * sortOrder;
    } else if (sortBy === "task") {
      return compareValue(a.task, b.task) * sortOrder;
    } else if (sortBy === "date") {
      return (new Date(a.createdAt) - new Date(b.createdAt)) * sortOrder;
    } else if (sortBy === "time") {
      return (a.time - b.time) * sortOrder;
    }

    return 0;
  });

  const indexOfLastSession = currentPage * sessionsPerPage;
  const indexOfFirstSession = indexOfLastSession - sessionsPerPage;
  const currentSessions = sortedSessions.slice(
    indexOfFirstSession,
    indexOfLastSession,
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
      <div className="m-2 rounded border border-fire-brick md:mx-auto md:w-10/12 lg:mx-auto lg:mt-8 lg:w-3/4">
        <div className="bg-red-500 p-4">
          <button
            onClick={() => navigateTo("/")}
            className="float-right rounded bg-fire-brick p-2 font-bold text-white hover:bg-red-600"
            style={{ width: "2.5rem", height: "2.5rem" }}
          >
            x
          </button>
          <div className="flex-column mb-4 items-center justify-between p-4">
            <h1 className="text-4xl font-bold text-white">Sessions</h1>
          </div>
        </div>
        <div className="sm:p-4">
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th
                  className="cursor-pointer p-2 text-center"
                  onClick={() => handleSort("category")}
                >
                  Category
                </th>
                <th
                  className="cursor-pointer p-2 text-center"
                  onClick={() => handleSort("task")}
                >
                  Task
                </th>
                <th
                  className="cursor-pointer p-2 text-center"
                  onClick={() => handleSort("date")}
                >
                  Date
                </th>
                <th
                  className="cursor-pointer p-2 text-center"
                  onClick={() => handleSort("time")}
                >
                  Time
                </th>
                <th className="p-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentSessions.map((session) => (
                <tr key={session.id}>
                  <td className="p-1 text-center">{session.category}</td>
                  <td className="p-1 text-center">{session.task}</td>
                  <td className="p-1 text-center">
                    {formatDateTime(session.createdAt)}
                  </td>
                  <td className="p-1 text-center">{session.time}</td>
                  <td className="p-1 text-center">
                    <button
                      onClick={() => deleteSession(session.id)}
                      className="rounded bg-red-500 px-3 py-1 text-white"
                    >
                      x
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <ul className="flex justify-center">
            {Array.from({
              length: Math.ceil(sortedSessions.length / sessionsPerPage),
            }).map((_, index) => (
              <li key={index} className="mx-1">
                <button
                  onClick={() => paginate(index + 1)}
                  className="my-2 rounded bg-red-500 px-4 py-2 text-white"
                >
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sessions;
