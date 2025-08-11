import React from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';

const CountdownTimer = ({ targetDate, title = "Marathon Starts In" }) => {
  const now = new Date().getTime();
  const target = new Date(targetDate).getTime();
  const duration = Math.max(0, Math.floor((target - now) / 1000));

  if (duration <= 0) {
    return (
      <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300">Event has started!</p>
      </div>
    );
  }

  const renderTime = (dimension, time) => {
    return (
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          {time}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          {dimension}
        </div>
      </div>
    );
  };

  const calculateRemainingTime = (time) => {
    const days = Math.floor(time / (24 * 60 * 60));
    const hours = Math.floor((time % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((time % (60 * 60)) / 60);
    const seconds = time % 60;

    return { days, hours, minutes, seconds };
  };

  return (
    <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>
      
      <div className="flex justify-center mb-4">
        <CountdownCircleTimer
          isPlaying
          duration={duration}
          initialRemainingTime={duration}
          colors={['#004777', '#F7B801', '#A30000', '#A30000']}
          colorsTime={[duration * 0.7, duration * 0.5, duration * 0.2, 0]}
          size={120}
          strokeWidth={6}
        >
          {({ remainingTime }) => {
            const { days, hours, minutes, seconds } = calculateRemainingTime(remainingTime);
            return (
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {days}d
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {hours}h {minutes}m
                </div>
              </div>
            );
          }}
        </CountdownCircleTimer>
      </div>
      
      <div className="grid grid-cols-4 gap-2 text-sm">
        <CountdownCircleTimer
          isPlaying
          duration={duration}
          initialRemainingTime={duration}
          colors={['#004777']}
          size={60}
          strokeWidth={4}
        >
          {({ remainingTime }) => {
            const { days } = calculateRemainingTime(remainingTime);
            return renderTime('Days', days);
          }}
        </CountdownCircleTimer>
        
        <CountdownCircleTimer
          isPlaying
          duration={duration}
          initialRemainingTime={duration}
          colors={['#F7B801']}
          size={60}
          strokeWidth={4}
        >
          {({ remainingTime }) => {
            const { hours } = calculateRemainingTime(remainingTime);
            return renderTime('Hours', hours);
          }}
        </CountdownCircleTimer>
        
        <CountdownCircleTimer
          isPlaying
          duration={duration}
          initialRemainingTime={duration}
          colors={['#A30000']}
          size={60}
          strokeWidth={4}
        >
          {({ remainingTime }) => {
            const { minutes } = calculateRemainingTime(remainingTime);
            return renderTime('Minutes', minutes);
          }}
        </CountdownCircleTimer>
        
        <CountdownCircleTimer
          isPlaying
          duration={duration}
          initialRemainingTime={duration}
          colors={['#A30000']}
          size={60}
          strokeWidth={4}
        >
          {({ remainingTime }) => {
            const { seconds } = calculateRemainingTime(remainingTime);
            return renderTime('Seconds', seconds);
          }}
        </CountdownCircleTimer>
      </div>
    </div>
  );
};

export default CountdownTimer;