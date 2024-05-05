import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_BASE_API_URL;

const UserSettings = () => {
  const {
    id,
    nickname,
    settings,
    fetchSessions,
    fetchCategories,
    fetchTasks,
    fetchSettings,
  } = useOutletContext();
  const navigateTo = useNavigate();

  const [breakDuration, setBreakDuration] = useState(
    settings ? settings.breakDuration : 5,
  );
  const [alarmSound, setAlarmSound] = useState(
    settings ? settings.alarmSound : "bell",
  );

  const [autoResume, setAutoResume] = useState(
    settings ? settings.autoResume : "true",
  );

  const deleteAllData = async () => {
    try {
      await axios.delete(`${API_URL}/user/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchSessions();
      fetchCategories();
      fetchTasks();
      fetchSettings();
      toast.success("User data deleted");
      navigateTo("/");
    } catch (error) {
      toast.error("Error deleting user data");
      console.error("Error deleting user data:", error);
    }
  };

  const updateSettings = async () => {
    try {
      await axios.put(
        `${API_URL}/settings/${id}/${breakDuration}/${alarmSound}/${autoResume}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      fetchSettings();
      toast.success("Settings updated");
    } catch (error) {
      toast.error("Error updating settings");
      console.error("Error updating settings:", error);
    }
  };

  useEffect(() => {
    setBreakDuration(settings.breakDuration);
    setAlarmSound(settings.alarmSound);
    setAutoResume(settings.autoResume);
  }, [settings]);

  return (
    <div className="m-2 rounded border border-fire-brick md:mx-auto md:w-10/12 lg:mx-auto lg:mt-8 lg:w-1/4">
      <div className="rounded-lg p-4">
        <button
          onClick={() => navigateTo("/")}
          className="float-right rounded bg-fire-brick p-2 font-bold  hover:bg-red-600"
          style={{ width: "2.5rem", height: "2.5rem" }}
        >
          x
        </button>
        <h2 className="mb-4 text-xl font-semibold ">{nickname} settings</h2>

        <div className="mx-auto mt-4 w-10/12 flex-row justify-center align-middle">
          <label htmlFor="breakDuration" className="block">
            Break duration
          </label>
          <input
            id="breakDuration"
            type="text"
            maxLength="2"
            value={breakDuration}
            onChange={(e) => setBreakDuration(e.target.value)}
            className="mt-2 w-full rounded px-4 py-2"
          />

          <label htmlFor="alarmSound" className="mt-4 block">
            Alarm sound
          </label>
          <select
            id="alarmSound"
            value={alarmSound}
            onChange={(e) => setAlarmSound(e.target.value)}
            className="mt-2 w-full rounded px-4 py-2"
          >
            <option value="bell">Default (Bell)</option>
            <option value="alarm">Alarm</option>
            <option value="none">None</option>
          </select>

          <label htmlFor="autoResume" className="mt-4 block">
            Auto resume
          </label>
          <select
            id="autoResume"
            value={autoResume}
            onChange={(e) => setAutoResume(e.target.value)}
            className="mt-2 w-full rounded px-4 py-2"
          >
            <option value="true">On</option>
            <option value="false">Off</option>
          </select>

          <button
            onClick={updateSettings}
            className="mt-4 inline-block rounded border-2 border-rose-700 px-4 py-2 text-xl font-bold leading-none hover:border-rose-900"
          >
            Update settings
          </button>
        </div>
        <div className="flex justify-center">
          <button
            onClick={deleteAllData}
            className="mt-4 inline-block rounded border-2 border-rose-700 px-4 py-2 text-xl font-bold leading-none hover:border-rose-900"
          >
            Delete all data
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
