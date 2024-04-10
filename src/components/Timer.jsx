import { useState, useEffect } from 'react';
import axios from 'axios';

const Timer = () => {
  const [sessionCount, setSessionCount] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState(5);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentTimer, setCurrentTimer] = useState(0);
  const [timer, setTimer] = useState(null);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const userId = localStorage.getItem('userId');

  const startTimer = () => {
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
  }, [isTimerRunning, currentTimer, timer]);

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

  const saveTimerSession = async () => {
    try {
      const fetchSessionData = async () => {
        try {
          const sessionResponse = await axios.get(
            `http://wierzba.wzks.uj.edu.pl:12122/sessionCountToday/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            }
          );
          const sessionData = sessionResponse.data;

          const durationResponse = await axios.get(
            `http://wierzba.wzks.uj.edu.pl:12122/totalDurationToday/${userId}`,
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
      };
      const response = await axios.post(
        `http://wierzba.wzks.uj.edu.pl:12122/saveTimerSession/${userId}/${selectedDuration}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      console.log(response);
      fetchSessionData();
    } catch (error) {
      console.error('Error saving timer session:', error);
    }
  };

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const sessionResponse = await axios.get(
          `http://wierzba.wzks.uj.edu.pl:12122/sessionCountToday/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        const sessionData = sessionResponse.data;

        const durationResponse = await axios.get(
          `http://wierzba.wzks.uj.edu.pl:12122/totalDurationToday/${userId}`,
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
    };

    fetchSessionData();

    return () => clearInterval(timer);
  }, [userId, selectedDuration, timer]);

  return (
    <>
      <div className='w-1/4 mx-auto mt-8'>
        <div className='bg-gray-900 p-4 rounded-t-lg'>
          <div className='flex items-center justify-between mb-4 p-4'>
            <button
              id='startPauseTimer'
              className='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600'
              onClick={isTimerRunning ? pauseTimer : startTimer}
            >
              {isTimerRunning
                ? paused
                  ? 'Resume Timer'
                  : 'Pause Timer'
                : 'Start Timer'}
            </button>
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
              }}
            >
              Reset Timer
            </button>
          </div>
          <div className='flex items-center justify-between mb-4'>
            <p id='timerDisplay' className='text-xl font-semibold mb-4'>
              Timer: {currentTimer} seconds
            </p>
          </div>
          <div className='relative h-4 bg-gray-700 rounded'>
            <div
              id='progressBar'
              className='h-full bg-blue-500 rounded'
              style={{ width: `${progress}%`, transition: 'width 1.3s linear' }}
            ></div>
          </div>
          <select
            id='timerDuration'
            className='bg-gray-800 text-white py-2 px-4 rounded mt-4 w-full'
            value={selectedDuration}
            onChange={(e) => setSelectedDuration(Number(e.target.value))}
          >
            <option value='5'>5 seconds</option>
            <option value='6'>6 seconds</option>
            <option value='7'>7 seconds</option>
          </select>

          <input
            id='customDuration'
            className='bg-gray-800 text-white py-2 px-4 rounded mt-4 w-full'
            type='text'
            placeholder='Custom duration in seconds'
            value={selectedDuration}
            onChange={(e) => setSelectedDuration(Number(e.target.value))}
          />
        </div>
        <div className='bg-gray-800 p-4'>
          <h2 className='text-xl text-gray-200 font-semibold mb-2'>
            Today&apos;s Session Data
          </h2>
          {sessionCount === 0 ? (
            <p className='text-gray-200 text-m'>No sessions today</p>
          ) : (
            <>
              <p className='text-gray-200 text-m'>
                Sessions today: {sessionCount}
              </p>
              <p className='text-gray-200 text-m'>
                Total duration today: {totalDuration} seconds
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Timer;
