import React from "react";

interface GreetingProps {
  userName: string;
}

export default function Greeting({ userName }: GreetingProps) {
  const [greeting, setGreeting] = React.useState<string>("");

  React.useEffect(() => {
    const hour = new Date().getHours();
    let g = "";
    if (hour < 12) g = "Good Morning";
    else if (hour < 17) g = "Good Afternoon";
    else if (hour < 21) g = "Good Evening";
    else g = "Good Night";
    setGreeting(g);
  }, []);

  return (
    <h1 className="text-3xl font-bold">
      {greeting}, {userName}
    </h1>
  );
}
