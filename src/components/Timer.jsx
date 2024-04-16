import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import Task from './Task';

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

  // const fetchSessionDataAndDuration = async () => {
  //   try {
  //     const sessionResponse = await axios.get(
  //       `http://localhost:3000/sessionCountToday/${userId}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem('token')}`,
  //         },
  //       }
  //     );
  //     const sessionData = sessionResponse.data;

  //     const durationResponse = await axios.get(
  //       `http://localhost:3000/totalDurationToday/${userId}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem('token')}`,
  //         },
  //       }
  //     );
  //     const durationData = durationResponse.data;

  //     setSessionCount(sessionData.sessionCount);
  //     setTotalDuration(durationData.totalDuration);
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // };

  const fetchSessionDataAndDuration = useCallback(async () => {
    try {
      const sessionResponse = await axios.get(
        `http://localhost:3000/sessionCountToday/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      const sessionData = sessionResponse.data;

      const durationResponse = await axios.get(
        `http://localhost:3000/totalDurationToday/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      const durationData = durationResponse.data;

      setSessionCount(sessionData.sessionCount);
      setTotalDuration(durationData.totalDuration);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [userId]);

  const saveTimerSession = useCallback(async () => {
    try {
      const response = await axios.post(
        `http://localhost:3000/saveTimerSession/${userId}/${selectedDuration}/${selectedTask}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      toast.success('Timer session saved');
      console.log(response);
      fetchTasks();
      fetchSessions();
      fetchSessionDataAndDuration();
    } catch (error) {
      toast.error('Error saving timer session');
      console.error('Error saving timer session:', error);
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
      toast.error('Task already completed');
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
      }, 1000)
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

  // const saveTimerSession = async () => {
  //   try {
  //     const response = await axios.post(
  //       `http://localhost:3000/saveTimerSession/${userId}/${selectedDuration}/${selectedTask}`,
  //       null,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem('token')}`,
  //         },
  //       }
  //     );
  //     toast.success('Timer session saved');
  //     console.log(response);
  //     fetchTasks();
  //     fetchSessions();
  //     fetchSessionDataAndDuration();
  //   } catch (error) {
  //     toast.error('Error saving timer session');
  //     console.error('Error saving timer session:', error);
  //   }
  // };

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
      <div className='w-1/4 mx-auto mt-8'>
        <div className='bg-gray-900 p-4 rounded-t-lg'>
          <div className='flex items-center justify-between mb-4 p-4'>
            <button
              id='startPauseTimer'
              className='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600'
              onClick={isTimerRunning ? pauseTimer : startTimer}
              disabled={selectedTask === 0}
            >
              {isTimerRunning
                ? paused
                  ? 'Resume Timer'
                  : 'Pause Timer'
                : 'Start Timer'}
            </button>
            <h1 className='text-4xl font-bold'>Timer</h1>
            <button
              id='resetTimer'
              className='bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600'
              onClick={() => {
                clearInterval(timer);
                setTimer(null);
                setIsTimerRunning(false);
                setCurrentTimer(0);
                setProgress(0);
                setRemainingTime(0);
                setSelectedTask(0);
              }}
            >
              Reset Timer
            </button>
          </div>
          <div className='flex items-center justify-center mb-4'>
            <p className='text-9xl font-semibold mb-4'>{currentTimer}</p>
          </div>
          <div className='relative h-4 bg-gray-700 rounded'>
            <div
              id='progressBar'
              className='h-full bg-blue-500 rounded'
              style={{ width: `${progress}%`, transition: 'width 1s linear' }}
            ></div>
          </div>
          <select
            id='timerDuration'
            className='bg-gray-800 text-white py-2 px-4 rounded mt-4 w-full'
            value={selectedDuration}
            onChange={(e) => setSelectedDuration(Number(e.target.value))}
          >
            <option value='5'>5 minutes</option>
            <option value='15'>15 minutes</option>
            <option value='25'>25 minutes</option>
          </select>

          <input
            id='customDuration'
            className='bg-gray-800 text-white py-2 px-4 rounded mt-4 w-full'
            type='text'
            placeholder='Custom duration in seconds'
            value={selectedDuration}
            onChange={(e) => setSelectedDuration(Number(e.target.value))}
          />
          <select
            id='taskSelect'
            className='bg-gray-800 text-white py-2 px-4 rounded mt-4 w-full'
            type='text'
            value={selectedTask}
            onChange={(e) => setSelectedTask(Number(e.target.value))}
          >
            <option value='0'>Select task for this session</option>
            {userTasks
              .filter((task) => task.status === 'pending')
              .map((task) => (
                <option key={task.id} value={task.id}>
                  {task.title}
                </option>
              ))}
          </select>
        </div>
        <div className='bg-gray-800 p-4'>
          <h2 className='text-xl text-gray-200 font-semibold mb-2'>
            Today&apos;s Sessions
          </h2>
          {sessionCount === 0 ? (
            <p className='text-gray-200 text-m'>No sessions today</p>
          ) : (
            <>
              <p className='text-gray-200 text-m'>
                Sessions today: {sessionCount}
              </p>
              <p className='text-gray-200 text-m'>
                Total duration today: {totalDuration} minutes
              </p>
            </>
          )}
          <div className='flex items-center justify-between align-middle mt-4'>
            <Link
              to='/sessions'
              className='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600'
            >
              View all sessions
            </Link>
          </div>
        </div>
        {!creatingTask && selectedTask === 0 && (
          <div className='flex items-center justify-center align-middle mt-4'>
            <button
              id='createTaskButton'
              className=' text-white font-bold text-xl px-20 py-10 rounded hover:bg-blue-600 border-dashed border-2 border-sky-500 opacity-70'
              onClick={toggleTaskForm}
            >
              + Create Task
            </button>
          </div>
        )}
      </div>
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
