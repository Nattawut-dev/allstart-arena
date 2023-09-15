// ไฟล์: utils/countdown.ts
import { useEffect, useState } from 'react';

const COUNTDOWN_INTERVAL = 1000; // นับเวลาทุกๆ 1 วินาที

const useCountdown = (targetTime: Date, countdownMinutes: number) => {
  const [remainingTime, setRemainingTime] = useState(() => {
    const currentTime = new Date();
    const timeDifference = targetTime.getTime() - currentTime.getTime();
    return timeDifference < 0 ? timeDifference : 0;
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentTime = new Date();
      const timeDifference = targetTime.getTime() - currentTime.getTime();
      setRemainingTime(timeDifference < 0 ? timeDifference : 0);
    }, COUNTDOWN_INTERVAL);

    return () => clearInterval(intervalId);
  }, [targetTime]);

  const countdownTime = countdownMinutes * 60 * 1000;
  const totalRemainingTime = remainingTime + countdownTime;

  const minutesRemaining = Math.floor((totalRemainingTime / 1000 / 60) % 60);
  const secondsRemaining = Math.floor((totalRemainingTime / 1000) % 60);

  return { minutesRemaining, secondsRemaining };
};

export default useCountdown;
