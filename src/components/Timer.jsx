import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Task from "./Task";
import bell from "/src/assets/bell.mp3";
import alarm from "/src/assets/alarm.mp3";
import { clearInterval, setInterval } from "worker-timers";

const Timer = ({
  id,
  sessions,
  categories,
  tasks,
  settings,
  fetchSessions,
  fetchCategories,
  fetchTasks,
}) => {
  const userId = id;
  const userSettings = settings;
  const userCategories = categories;
  const userTasks = tasks;
  const [sessionCount, setSessionCount] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState(5);
  const [selectedTask, setSelectedTask] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentTimer, setCurrentTimer] = useState(0);
  const [timer, setTimer] = useState(null);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [creatingTask, setCreatingTask] = useState(false);
  const [currentBreak, setCurrentBreak] = useState(0);
  const [isBreak, setIsBreak] = useState(false);
  const [breakTimer, setBreakTimer] = useState(null);

  const API_URL = import.meta.env.VITE_BASE_API_URL;
  const PATH_URL = import.meta.env.VITE_BASE_PATH_URL;

  const saveTimerSession = useCallback(async () => {
    try {
      const response = await axios.post(
        `${API_URL}/saveTimerSession/${userId}/${selectedDuration}/${selectedTask}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      toast.success("Timer session saved");
      console.log(response);
      // const audio = new Audio(bell);
      // audio.play();
      if (userSettings.alarmSound === "bell") {
        const audio = new Audio(bell);
        audio.play();
      } else if (userSettings.alarmSound === "alarm") {
        const audio = new Audio(alarm);
        audio.play();
      } else if (userSettings.alarmSound === "none") {
        // do nothing
      }

      fetchTasks();
      fetchSessions();
    } catch (error) {
      toast.error("Error saving timer session");
      console.error("Error saving timer session:", error);
    }
  }, [
    userId,
    selectedDuration,
    selectedTask,
    fetchSessions,
    fetchTasks,
    userSettings,
    API_URL,
  ]);

  const startTimer = () => {
    if (selectedTask === 0) {
      toast.error("Please select a task");
      return;
    }
    if (
      userTasks.find((task) => task.id === selectedTask).sessionCount ===
      userTasks.find((task) => task.id === selectedTask).sessionsToComplete
    ) {
      toast.error("Task already completed");
      return;
    }
    if (isBreak && breakTimer) {
      clearInterval(breakTimer);
      setBreakTimer(null);
      setIsBreak(false);
    }

    setIsTimerRunning(true);
    const startTime = remainingTime > 0 ? remainingTime : selectedDuration * 60;
    // const startTime = remainingTime > 0 ? remainingTime : selectedDuration;
    setCurrentTimer(startTime);
    if (remainingTime === 0) {
      setProgress(0);
    }

    setTimer(
      setInterval(() => {
        setCurrentTimer((prev) => {
          const nextTimer = prev - 1;
          if (nextTimer <= 0) {
            clearInterval(timer);
            setIsTimerRunning(false);
            setRemainingTime(0); // reset time when timer ends
            return 0;
          }
          return nextTimer;
        });
        setProgress((prev) => {
          const newProgress = prev + 100 / (selectedDuration * 60);
          return newProgress > 100 ? 100 : newProgress;
        });
      }, 1000),
    );
  };

  const pauseTimer = () => {
    if (paused) {
      startTimer();
      setPaused(false);
      if (isBreak && breakTimer) {
        clearInterval(breakTimer);
        setBreakTimer(null);
        setIsBreak(false);
      }
    } else {
      clearInterval(timer);
      setPaused(true);
      setRemainingTime(currentTimer);
    }
  };

  const startBreak = () => {
    if (isTimerRunning) {
      clearInterval(timer);
      setTimer(null);
      setPaused(true);
      setRemainingTime(currentTimer);
    }

    if (isBreak) {
      clearInterval(breakTimer);
      setBreakTimer(null);
      setIsBreak(false);
      return;
    }

    setIsBreak(true);
    const breakDuration = userSettings.breakDuration * 60 || 5 * 60;
    setCurrentBreak(breakDuration);
    const newBreakTimer = setInterval(() => {
      setCurrentBreak((prev) => {
        const nextBreak = prev - 1;
        if (nextBreak <= 0) {
          clearInterval(newBreakTimer);
          setIsBreak(false);
          return 0;
        }
        return nextBreak;
      });
    }, 1000);
    setBreakTimer(newBreakTimer);
    toast.success("Break started");
  };

  const toggleTaskForm = () => {
    setCreatingTask(!creatingTask);
  };

  useEffect(() => {
    if (!isTimerRunning && currentTimer === 0 && timer) {
      saveTimerSession();
      setTimer(null);
    }
  }, [isTimerRunning, currentTimer, timer, saveTimerSession]);

  useEffect(() => {
    const today = new Date().toLocaleDateString();
    const todaySessions = sessions.filter((session) => {
      const sessionDate = new Date(session.createdAt).toLocaleDateString();
      return sessionDate === today;
    });
    setSessionCount(todaySessions.length);
    const time = todaySessions.reduce((acc, session) => {
      return acc + session.time;
    }, 0);
    setTotalDuration(time);
  }, [sessions]);

  useEffect(() => {
    return () => clearInterval(timer);
  }, [timer]);

  useEffect(() => {
    setCreatingTask(false);
  }, [selectedTask]);

  const handleUnpauseAfterBreak = async () => {
    if (userSettings.autoResume) {
      setPaused(false);
      startTimer();
    }
  };

  useEffect(() => {
    if (!isBreak && currentBreak === 0 && breakTimer && selectedTask !== 0) {
      handleUnpauseAfterBreak();
    }
  }, [isBreak, currentBreak, breakTimer, selectedTask]);

  useEffect(() => {
    if (selectedTask === 0) {
      clearInterval(timer);
      setTimer(null);
      setIsTimerRunning(false);
      setCurrentTimer(0);
      setProgress(0);
      setRemainingTime(0);
      setPaused(false);
      setIsBreak(false);
      setCurrentBreak(0);
    }
  }, [selectedTask, timer]);

  return (
    <>
      <div className="mx-2 mt-4 rounded border-2 border-fire-brick md:mx-auto md:w-10/12 lg:mx-auto lg:mt-4 lg:w-1/4">
        <div className="rounded-t-lg p-2 md:p-4">
          <div className="mb-4 flex items-center justify-between p-4">
            <button
              id="startPauseTimer"
              // className="m-2 rounded border border-fire-brick px-4 py-2 font-bold"
              className={`m-2 
              rounded
              border-fire-brick
              px-4 py-2 font-bold hover:bg-red-600 hover:text-white ${
                isTimerRunning ? "border-2" : "border"
              }`}
              onClick={isTimerRunning ? pauseTimer : startTimer}
            >
              {isTimerRunning
                ? paused
                  ? "Resume Timer"
                  : "Pause Timer"
                : "Start Timer"}
            </button>

            <button
              id="startBreak"
              // className="rounded border border-fire-brick px-4 py-2 font-bold "
              className={`m-2 
              rounded
              border-fire-brick
              px-4 py-2 font-bold hover:bg-red-600 hover:text-white ${
                isBreak ? "border-2" : "border"
              }`}
              onClick={startBreak}
            >
              {isBreak ? "End Break" : "Start Break"}
            </button>

            <button
              id="resetTimer"
              className="m-2 rounded border border-fire-brick px-4 py-2 font-bold hover:bg-red-600 hover:text-white"
              onClick={() => {
                clearInterval(timer);
                setTimer(null);
                setIsTimerRunning(false);
                setCurrentTimer(0);
                setProgress(0);
                setRemainingTime(0);
                setSelectedTask(0);
                setSelectedDuration(5);
                setPaused(false);
                setIsBreak(false);
                setCurrentBreak(0);
                toast.success("Timer has been reset");
              }}
            >
              Reset Timer
            </button>
          </div>
          <div className="mb-4 flex items-center justify-center">
            {!isBreak ? (
              <p className="mb-4 text-9xl font-semibold">
                {Math.floor(currentTimer / 60)}:
                {currentTimer % 60 < 10
                  ? `0${currentTimer % 60}`
                  : currentTimer % 60}
              </p>
            ) : (
              <p className="mb-4 text-9xl font-semibold">
                {Math.floor(currentBreak / 60)}:
                {currentBreak % 60 < 10
                  ? `0${currentBreak % 60}`
                  : currentBreak % 60}
              </p>
            )}
          </div>
          <div className="relative h-4 rounded border border-gray-800 bg-white">
            <div
              id="progressBar"
              className="h-full rounded bg-red-500"
              style={{ width: `${progress}%`, transition: "width 1s linear" }}
            ></div>
          </div>
          <select
            id="timerDuration"
            className="mt-4 w-full rounded  px-4 py-2 "
            value={selectedDuration}
            onChange={(e) => setSelectedDuration(Number(e.target.value))}
          >
            <option value="5">5 minutes</option>
            <option value="15">15 minutes</option>
            <option value="25">25 minutes</option>
          </select>

          <input
            id="customDuration"
            className="0 mt-4 w-full rounded px-4 py-2 "
            type="number"
            placeholder="Custom duration in minutes"
            maxLength="2"
            min="1"
            onChange={(e) => setSelectedDuration(Number(e.target.value))}
          />
          <select
            id="taskSelect"
            className="mt-4 w-full rounded  px-4 py-2 "
            type="text"
            value={selectedTask}
            onChange={(e) => setSelectedTask(Number(e.target.value))}
          >
            <option value="0">Select task for this session</option>
            {userTasks
              .filter((task) => task.status === "pending")
              .map((task) => (
                <option key={task.id} value={task.id}>
                  {task.title}
                </option>
              ))}
          </select>
        </div>
        <div className="bg-red-500 p-4">
          <h2 className="mb-2 text-xl font-semibold text-gray-200">
            Today&apos;s Sessions
          </h2>
          {sessionCount === 0 ? (
            <p className="text-m text-gray-200">No sessions today</p>
          ) : (
            <>
              <p className="text-m text-gray-200">
                Sessions today: {sessionCount}
              </p>
              <p className="text-m text-gray-200">
                Total duration today: {totalDuration}{" "}
                {totalDuration === 1 ? "minute" : "minutes"}
              </p>
            </>
          )}
          <div className="mt-4 flex items-center justify-between align-middle lg:w-full">
            <Link
              to={PATH_URL + "/sessions"}
              className="rounded bg-fire-brick p-2 text-white hover:bg-red-600 lg:mr-2 lg:px-4 lg:py-2"
            >
              View all sessions
            </Link>
            <Link
              to={PATH_URL + "/completed-tasks"}
              className=" rounded bg-fire-brick p-2 text-white hover:bg-red-600  lg:px-4 lg:py-2"
            >
              View completed tasks
            </Link>
          </div>
        </div>
      </div>
      {!creatingTask && selectedTask === 0 && (
        <div className="mt-4 flex items-center justify-center align-middle">
          <button
            id="createTaskButton"
            className=" rounded border-2 border-dashed border-red-500 px-20 py-10 text-xl font-bold  opacity-70 hover:bg-red-600"
            onClick={toggleTaskForm}
          >
            + Create Task
          </button>
        </div>
      )}
      <Task
        userId={userId}
        userCategories={userCategories}
        fetchCategories={fetchCategories}
        userTasks={userTasks}
        fetchTasks={fetchTasks}
        selectedTask={selectedTask}
        setSelectedTask={setSelectedTask}
        creatingTask={creatingTask}
        setCreatingTask={setCreatingTask}
        fetchSessions={fetchSessions}
      />
    </>
  );
};

Timer.propTypes = {
  id: PropTypes.number.isRequired,
  sessions: PropTypes.arrayOf(PropTypes.object).isRequired,
  categories: PropTypes.arrayOf(PropTypes.object).isRequired,
  tasks: PropTypes.arrayOf(PropTypes.object).isRequired,
  settings: PropTypes.object.isRequired,
  fetchCategories: PropTypes.func.isRequired,
  fetchSessions: PropTypes.func.isRequired,
  fetchTasks: PropTypes.func.isRequired,
};

export default Timer;
