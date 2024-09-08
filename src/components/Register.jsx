import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigateTo = useNavigate();

  const API_URL = import.meta.env.VITE_BASE_API_URL;
  const PATH_URL = import.meta.env.VITE_BASE_PATH_URL;

  const handleSubmit = async () => {
    if (username.length < 3 || username.length > 16) {
      toast.error("Username must be between 3 and 16 characters long");
      return;
    }

    if (password.length < 3 || password.length > 64) {
      toast.error("Password must be between 3 and 64 characters long");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/signup`, {
        username,
        password,
        confirmPassword,
      });
      toast.success("Registration successful");
      navigateTo(PATH_URL + "/login");
    } catch (err) {
      if (err.response) {
        if (err.response.status === 400) {
          toast.error("User already exists");
          setError("User already exists");
        } else if (err.response.status === 401) {
          toast.error("Passwords do not match");
          setError("Passwords do not match");
        } else {
          toast.error("Registration failed");
          setError("Registration failed");
        }
      } else if (err.request) {
        toast.error("No response from server");
        setError("No response from server");
      } else {
        toast.error("Registration failed");
        setError("Registration failed");
      }
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center md:mt-10">
      <div className="grid grid-cols-1 gap-2">
        <h1 className="text-center text-4xl font-bold">Register</h1>
        <input
          type="text"
          placeholder="Username"
          maxLength="16"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="rounded border border-rose-300 p-2"
        />
        <input
          type="password"
          placeholder="Password"
          maxLength="64"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded border border-rose-300 p-2"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          maxLength="64"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="rounded border border-rose-300 p-2"
        />
        <button
          onClick={handleSubmit}
          className="rounded bg-fire-brick p-2 font-semibold text-white hover:bg-red-600"
        >
          Register
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default Register;
