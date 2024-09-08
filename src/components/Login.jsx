import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigateTo = useNavigate();
  const handleLogin = useOutletContext().handleLogin;

  const API_URL = import.meta.env.VITE_BASE_API_URL;
  const PATH_URL = import.meta.env.VITE_BASE_PATH_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (username.length < 3 || username.length > 16) {
      toast.error("Username must be between 3 and 16 characters long");
      return;
    }

    if (password.length < 3 || password.length > 64) {
      toast.error("Password must be between 3 and 64 characters long");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/login`, {
        username,
        password,
      });
      toast.success("Login successful");

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.userId);
      localStorage.setItem("nickname", response.data.nickname);
      console.log("Login successful:", response.data);
      handleLogin();
      navigateTo(PATH_URL + "/");
    } catch (error) {
      toast.error("Login failed");
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="flex items-center justify-center md:mt-10">
      <div className="grid grid-cols-1 gap-2">
        <h1 className="text-center text-4xl font-bold">Login</h1>
        <input
          type="text"
          placeholder="Username"
          maxLength="16"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="rounded border border-rose-300 p-2 "
        />
        <input
          type="password"
          placeholder="Password"
          maxLength="64"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded border border-rose-300 p-2"
        />
        <button
          onClick={handleSubmit}
          className="rounded bg-fire-brick p-2 font-semibold text-white hover:bg-red-600"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
