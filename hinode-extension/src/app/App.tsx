import React from "react";
import { HomePayload } from "../types/api";
import { getHomePayload } from "../services/apiClient";
import Greeting from "../components/Greeting";
import Clock from "../components/Clock";
import WeatherCard from "../components/WeatherCard";
import ShayariCard from "../components/ShayariCard";
import Background from "../components/Background";

export default function App() {
  const [payload, setPayload] = React.useState<HomePayload | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function load() {
      try {
        const data = await getHomePayload();
        setPayload(data);
      } catch (e) {
        console.error(e);
        setError("Failed to load data");
      }
    }
    load();
  }, []);

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!payload) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <Background imageUrl={payload.background?.image_url ?? ""}>
      <div className="flex flex-col items-center justify-center min-h-screen text-white p-4 space-y-4">
        <Greeting userName="Varun" />
        <Clock />
        {payload.weather && <WeatherCard weather={payload.weather} />}
        {payload.shayari && <ShayariCard shayari={payload.shayari} />}
      </div>
    </Background>
  );
}
