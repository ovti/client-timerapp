import { useState } from "react";
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

  // useEffect(() => {
  //   fetchSessions();
  //   fetchCategories();
  //   fetchTasks();
  // }, [fetchSessions, fetchCategories, fetchTasks]);

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

  const totalPages = Math.ceil(sortedSessions.length / sessionsPerPage);

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

    pageNumbers.push(
      <li key={1}>
        <button
          onClick={() => paginate(1)}
          className={`mx-1 my-2 rounded bg-red-500 px-4 py-2 text-white ${currentPage === 1 ? "bg-gray-800" : ""}`}
        >
          1
        </button>
      </li>,
    );

    if (totalPages > 5 && currentPage > 3) {
      pageNumbers.push(
        <li key="left-ellipsis">
          <span className="mx-1 my-2 flex items-center font-bold">...</span>
        </li>,
      );
    }

    // let start = currentPage > 3 ? currentPage - 2 : 2;
    // let end = currentPage < totalPages - 2 ? currentPage + 2 : totalPages - 1;
    let start = currentPage > 3 ? currentPage - 1 : 2;
    let end = currentPage < totalPages - 2 ? currentPage + 1 : totalPages - 1;

    for (let i = start; i <= end; i++) {
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

    if (totalPages > 5 && currentPage < totalPages - 2) {
      pageNumbers.push(
        <li key="right-ellipsis">
          <span className="mx-1 my-2 flex items-center font-bold">...</span>
        </li>,
      );
    }

    if (totalPages > 1) {
      pageNumbers.push(
        <li key={totalPages}>
          <button
            onClick={() => paginate(totalPages)}
            className={`mx-1 my-2 rounded bg-red-500 px-4 py-2 text-white ${currentPage === totalPages ? "bg-gray-800" : ""}`}
          >
            {totalPages}
          </button>
        </li>,
      );
    }

    return pageNumbers;
  };

  const indexOfLastSession = currentPage * sessionsPerPage;
  const indexOfFirstSession = indexOfLastSession - sessionsPerPage;
  const currentSessions = sortedSessions.slice(
    indexOfFirstSession,
    indexOfLastSession,
  );

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
        {sessions.length === 0 && (
          <div className="p-4">
            <h2 className="text-center">You have no saved sessions yet!</h2>
          </div>
        )}
        {sessions.length !== 0 && (
          <div className="flex flex-col items-center justify-center overflow-x-auto sm:p-4">
            <table className="w-3/4 table-auto">
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

export default Sessions;
