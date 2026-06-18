import React from "react";

interface GreetingProps {
  userName: string;
  className?: string;
}

export default function Greeting({ userName, className = "" }: GreetingProps) {
  const hour = new Date().getHours();
  let greeting = "";
  if (hour < 12) greeting = "Good Morning";
  else if (hour < 17) greeting = "Good Afternoon";
  else if (hour < 21) greeting = "Good Evening";
  else greeting = "Good Night";

  return (
    <h1
      aria-live="polite"
      className={`text-xl md:text-2xl font-medium text-hinode-text-secondary ${className}`}
    >
      {greeting}, {userName}
    </h1>
  );
}
