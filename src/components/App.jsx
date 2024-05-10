import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { Outlet, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Nav from "./Nav";
import Home from "./Home";
import UserDataFetching from "./UserDataFetching";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [id, setId] = useState("");
  const [nickname, setNickname] = useState("");
  const userId = localStorage.getItem("userId");
  const navigateTo = useNavigate();

  const PATH_URL = import.meta.env.VITE_BASE_PATH_URL;

  window.onerror = function (message) {
    if (message.includes("There is no interval scheduled with the given id")) {
      return true;
    }
  };

  const {
    categories,
    sessions,
    tasks,
    settings,
    fetchSettings,
    fetchCategories,
    fetchSessions,
    fetchTasks,
  } = UserDataFetching(userId);

  const handleLogin = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 > Date.now()) {
        setLoggedIn(true);
        setId(decodedToken.user.id);
        setNickname(decodedToken.user.username);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("nickname");
    setLoggedIn(false);
    toast.success("Logout successful");
    navigateTo(PATH_URL + "/");
  };

  useEffect(() => {
    handleLogin();
  }, []);

  return (
    <>
      <Nav
        loggedIn={loggedIn}
        onLogout={handleLogout}
        handleLogin={handleLogin}
      />
      <ToastContainer
        autoClose={2000}
        limit={3}
        draggable
        draggablePercent={60}
        closeButton={true}
        position="top-right"
      />
      {!loggedIn && (
        <div className="my-9 flex items-center justify-center">
          <div className="grid grid-cols-1 gap-6">
            <p className="text-center text-xl font-semibold md:text-4xl">
              Please login or register to continue
            </p>
          </div>
        </div>
      )}
      <Outlet
        context={{
          loggedIn,
          id,
          nickname,
          handleLogin,
          categories,
          fetchCategories,
          sessions,
          fetchSessions,
          tasks,
          fetchTasks,
          settings,
          fetchSettings,
        }}
      />
      {loggedIn && (
        <Home
          id={id}
          sessions={sessions}
          categories={categories}
          tasks={tasks}
          settings={settings}
          fetchCategories={fetchCategories}
          fetchSessions={fetchSessions}
          fetchTasks={fetchTasks}
        />
      )}
    </>
  );
}

export default App;
