import { useEffect, useState } from 'react';

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownProps {
  targetDate: Date;
}

export const Countdown = ({ targetDate }: CountdownProps) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      
      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ hours, minutes, seconds });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, '0');
  };

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="relative group">
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="bg-card border-2 border-primary/20 rounded-xl px-4 py-2 backdrop-blur-sm">
            <span className="text-4xl font-bold bg-gradient-to-br from-primary to-primary/50 text-transparent bg-clip-text">
              {formatNumber(value)}
            </span>
          </div>
          <div className="absolute inset-0 bg-primary/5 rounded-xl blur-xl -z-10 group-hover:bg-primary/10 transition-colors duration-300" />
        </div>
        <span className="text-xs font-medium text-muted-foreground mt-2 group-hover:text-primary transition-colors duration-300">
          {label}
        </span>
      </div>
    </div>
  );

  const Separator = () => (
    <div className="flex items-center justify-center -mt-4">
      <div className="w-1.5 h-1.5 rounded-full bg-primary/50 mx-1" />
      <div className="w-1.5 h-1.5 rounded-full bg-primary/50 mx-1" />
    </div>
  );

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 blur-3xl -z-10" />
      <div className="flex items-center gap-4">
        <TimeUnit value={timeLeft.hours} label="HOURS" />
        <Separator />
        <TimeUnit value={timeLeft.minutes} label="MINUTES" />
        <Separator />
        <TimeUnit value={timeLeft.seconds} label="SECONDS" />
      </div>
    </div>
  );
};
