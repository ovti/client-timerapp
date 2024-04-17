import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Task from "./Task";

const Timer = ({
  id,
  categories,
  tasks,
  fetchSessions,
  fetchCategories,
  fetchTasks,
}) => {
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
  const userId = id;
  const userCategories = categories;
  const userTasks = tasks;

  const fetchSessionDataAndDuration = useCallback(async () => {
    try {
      const sessionResponse = await axios.get(
        `http://localhost:3000/sessionCountToday/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      const sessionData = sessionResponse.data;

      const durationResponse = await axios.get(
        `http://localhost:3000/totalDurationToday/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      const durationData = durationResponse.data;

      setSessionCount(sessionData.sessionCount);
      setTotalDuration(durationData.totalDuration);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [userId]);

  const saveTimerSession = useCallback(async () => {
    try {
      const response = await axios.post(
        `http://localhost:3000/saveTimerSession/${userId}/${selectedDuration}/${selectedTask}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      toast.success("Timer session saved");
      console.log(response);
      fetchTasks();
      fetchSessions();
      fetchSessionDataAndDuration();
    } catch (error) {
      toast.error("Error saving timer session");
      console.error("Error saving timer session:", error);
    }
  }, [
    userId,
    selectedDuration,
    selectedTask,
    fetchSessions,
    fetchSessionDataAndDuration,
    fetchTasks,
  ]);

  const startTimer = () => {
    if (
      userTasks.find((task) => task.id === selectedTask).sessionCount ===
      userTasks.find((task) => task.id === selectedTask).sessionsToComplete
    ) {
      toast.error("Task already completed");
      return;
    }
    setIsTimerRunning(true);
    const startTime = remainingTime > 0 ? remainingTime : selectedDuration;
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
          const newProgress = prev + 100 / startTime;
          return newProgress > 100 ? 100 : newProgress;
        });
      }, 1000),
    );
  };

  useEffect(() => {
    if (!isTimerRunning && currentTimer === 0 && timer) {
      saveTimerSession();
      setTimer(null);
    }
  }, [isTimerRunning, currentTimer, timer, saveTimerSession]);

  const pauseTimer = () => {
    if (paused) {
      startTimer();
      setPaused(false);
    } else {
      clearInterval(timer);
      setPaused(true);
      setRemainingTime(currentTimer);
    }
  };

  const toggleTaskForm = () => {
    setCreatingTask(!creatingTask);
  };

  useEffect(() => {
    fetchSessionDataAndDuration();
    return () => clearInterval(timer);
  }, [
    userId,
    selectedDuration,
    selectedTask,
    timer,
    fetchSessions,
    fetchSessionDataAndDuration,
  ]);

  useEffect(() => {
    setCreatingTask(false);
  }, [selectedTask]);

  return (
    <>
      <div className="border-fire-brick mx-2 mt-4 rounded border-2  md:mx-auto md:w-10/12 lg:mx-auto lg:mt-8 lg:w-1/4">
        <div className="rounded-t-lg p-2 md:p-4">
          <div className="mb-4 flex items-center justify-between p-4">
            <button
              id="startPauseTimer"
              className="border-fire-brick rounded border px-4 py-2 font-bold "
              onClick={isTimerRunning ? pauseTimer : startTimer}
              disabled={selectedTask === 0}
            >
              {isTimerRunning
                ? paused
                  ? "Resume Timer"
                  : "Pause Timer"
                : "Start Timer"}
            </button>
            <button
              id="resetTimer"
              className="border-fire-brick rounded border px-4 py-2 font-bold "
              onClick={() => {
                clearInterval(timer);
                setTimer(null);
                setIsTimerRunning(false);
                setCurrentTimer(0);
                setProgress(0);
                setRemainingTime(0);
                setSelectedTask(0);
                toast.success("Timer has been reset");
              }}
            >
              Reset Timer
            </button>
          </div>
          <div className="mb-4 flex items-center justify-center">
            <p className="mb-4 text-9xl font-semibold">{currentTimer}</p>
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
            type="text"
            placeholder="Custom duration in seconds"
            value={selectedDuration}
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
                Total duration today: {totalDuration} minutes
              </p>
            </>
          )}
          <div className="mt-4 flex items-center justify-between align-middle">
            <Link
              to="/sessions"
              className="bg-fire-brick rounded px-4 py-2 text-white hover:bg-red-600"
            >
              View all sessions
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
      />
    </>
  );
};

Timer.propTypes = {
  id: PropTypes.number.isRequired,
  categories: PropTypes.arrayOf(PropTypes.object).isRequired,
  tasks: PropTypes.arrayOf(PropTypes.object).isRequired,
  fetchCategories: PropTypes.func.isRequired,
  fetchSessions: PropTypes.func.isRequired,
  fetchTasks: PropTypes.func.isRequired,
};

export default Timer;
