import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigateTo = useNavigate();
  const handleLogin = useOutletContext().handleLogin;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/login", {
        username,
        password,
      });
      toast.success("Login successful");

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.userId);
      localStorage.setItem("nickname", response.data.nickname);
      console.log("Login successful:", response.data);
      handleLogin();
      navigateTo("/");
    } catch (error) {
      toast.error("Login failed");
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="grid grid-cols-1 gap-6">
        <h1 className="text-center text-4xl font-bold">Login</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="rounded border border-gray-300 p-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded border border-gray-300 p-2"
        />
        <button
          onClick={handleSubmit}
          className="rounded bg-blue-500 p-2 text-white"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
