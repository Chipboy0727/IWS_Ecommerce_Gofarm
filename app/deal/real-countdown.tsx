"use client";

import { useState, useEffect } from "react";

function CountdownBox({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center bg-white rounded-lg p-2 sm:p-3 shadow-md border">
      <span className="text-lg sm:text-2xl md:text-3xl font-bold text-gofarm-green">{value}</span>
      <span className="text-xs sm:text-sm text-gray-600 font-medium">{label}</span>
    </div>
  );
}

export default function RealCountdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const diff = tomorrow.getTime() - now.getTime();
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      };
    };
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="grid grid-cols-4 gap-1 sm:gap-2">
      <CountdownBox value={String(timeLeft.days).padStart(2, "0")} label="Days" />
      <CountdownBox value={String(timeLeft.hours).padStart(2, "0")} label="Hours" />
      <CountdownBox value={String(timeLeft.minutes).padStart(2, "0")} label="Mins" />
      <CountdownBox value={String(timeLeft.seconds).padStart(2, "0")} label="Secs" />
    </div>
  );
}