import { useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const Sessions = () => {
  const { sessions, fetchSessions, fetchCategories, fetchTasks } =
    useOutletContext();
  const navigateTo = useNavigate();

  const sessionsByCategory = sessions.reduce((acc, session) => {
    if (!acc[session.Task.Category.category]) {
      acc[session.Task.Category.category] = [];
    }
    acc[session.Task.Category.category].push(session);
    return acc;
  }, {});

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

  return (
    <>
      <div className="border-fire-brick m-2 rounded border md:mx-auto md:w-10/12 lg:mx-auto lg:mt-8 lg:w-1/4">
        <div className=" bg-red-500 p-4">
          <button
            onClick={() => navigateTo("/")}
            className="bg-fire-brick float-right rounded p-2 font-bold text-white hover:bg-red-600"
            style={{ width: "2.5rem", height: "2.5rem" }}
          >
            x
          </button>
          <div className="flex-column mb-4 items-center justify-between p-4">
            <h1 className="text-4xl font-bold text-white">Sessions</h1>
          </div>
        </div>
        <div className=" p-4">
          <h2 className="mb-2 text-4xl font-semibold ">Session List</h2>
          {Object.keys(sessionsByCategory).length === 0 && (
            <p className="text-gray-200">No sessions found</p>
          )}
          {Object.keys(sessionsByCategory).map((category) => (
            <div key={category}>
              <h3 className="mb-2 text-xl font-semibold ">{category}</h3>
              <ul>
                {sessionsByCategory[category].map((session) => (
                  <li key={session.id} className="">
                    {formatDateTime(session.createdAt)} session -{" "}
                    {session.Task.title} - {session.time}{" "}
                    {session.time === 1 ? "minute" : "minutes"}
                    <button
                      onClick={() => deleteSession(session.id)}
                      className=" font-bold  hover:text-red-500"
                      style={{ width: "1.5rem", height: "1.5rem" }}
                    >
                      x
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sessions;
