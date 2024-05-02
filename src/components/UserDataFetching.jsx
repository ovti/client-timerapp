import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const UserDataFetching = (userId) => {
  const [categories, setCategories] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [settings, setSettings] = useState({});

  const fetchSettings = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/settings/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      setSettings(response.data);
      // console.log("Break duration:", response.data.breakDuration);
      // console.log("Alarm sound:", response.data.alarmSound);
      // console.log("Auto resume:", response.data.autoResume);
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  }, [userId]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/category/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, [userId]);

  const fetchSessions = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/sessions/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      setSessions(response.data);
      // console.log("Sessions:", response.data);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  }, [userId]);

  const fetchTasks = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/tasks/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      setTasks(response.data);
      // console.log("Tasks:", response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }, [userId]);

  useEffect(() => {
    fetchSettings();
    fetchCategories();
    fetchSessions();
    fetchTasks();
  }, [fetchCategories, fetchSessions, fetchTasks, fetchSettings]);

  return {
    categories,
    sessions,
    tasks,
    settings,
    fetchSettings,
    fetchCategories,
    fetchSessions,
    fetchTasks,
  };
};

export default UserDataFetching;
