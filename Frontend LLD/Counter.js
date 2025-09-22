import { useEffect, useState, useRef } from "react";

const Counter = () => {
  const zeroTime = { hr: 0, min: 0, sec: 0 };
  const [curTime, setCurTime] = useState(zeroTime);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const handleChange = (e) => {
    let { name, value } = e.target;
    value = Math.max(0, parseInt(value) || 0); // prevent negative/NaN
    setCurTime((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setCurTime(zeroTime);
    setIsRunning(false);
    clearInterval(intervalRef.current);
  };

  const handleStartStop = () => {
    setIsRunning((prev) => !prev);
  };

  useEffect(() => {
    if (!isRunning) {
      clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      const totalSeconds = curTime.hr * 3600 + curTime.min * 60 + curTime.sec;

      if (totalSeconds <= 0) {
        clearInterval(intervalRef.current);
        setIsRunning(false);
        return;
      }

      const newTotal = totalSeconds - 1;
      const newHr = Math.floor(newTotal / 3600);
      const newMin = Math.floor((newTotal % 3600) / 60);
      const newSec = newTotal % 60;

      setCurTime({ hr: newHr, min: newMin, sec: newSec });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isRunning, curTime]);

  return (
    <div>
      <div>
        <input
          type="number"
          min={0}
          name="hr"
          value={curTime.hr}
          onChange={handleChange}
        />
        :
        <input
          type="number"
          min={0}
          max={59}
          name="min"
          value={curTime.min}
          onChange={handleChange}
        />
        :
        <input
          type="number"
          min={0}
          max={59}
          name="sec"
          value={curTime.sec}
          onChange={handleChange}
        />
      </div>
      <div>
        <button onClick={handleStartStop}>
          {isRunning ? "Stop" : "Start"}
        </button>
        <button onClick={handleReset}>Reset</button>
      </div>
    </div>
  );
};

export default Counter;
