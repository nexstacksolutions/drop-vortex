import styles from "./DealTimer.module.css";
import { useState, useEffect, useCallback } from "react";
import classNames from "classnames";

function DealTimer({ endTime, customClass }) {
  const calculateTimeLeft = useCallback(() => {
    const difference = +new Date(endTime) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  }, [endTime]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, calculateTimeLeft]);

  // Check if the time has ended, and if so, return null
  const isTimeUp =
    !timeLeft.days && !timeLeft.hours && !timeLeft.minutes && !timeLeft.seconds;

  if (isTimeUp) {
    return null;
  }

  return (
    <div
      className={classNames(styles.dealTimer, {
        [customClass]: customClass,
      })}
    >
      Offer Ends in: {timeLeft.days || 0} days, {timeLeft.hours || "00"} :{" "}
      {timeLeft.minutes || "00"} : {timeLeft.seconds || "00"}
    </div>
  );
}

export default DealTimer;
