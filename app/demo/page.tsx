"use client"
import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "@/lib/firebase-client";

interface SensorValues {
  temperature: number;
  humidity: number;
  pressure: number;
}

export default function PublicSensorReadings() {
  const [readings, setReadings] = useState<Array<{ 
    timestamp: string;
    sensors: Record<string, SensorValues>
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = "nm6IqzytYtbaLgDkanvHuIyGpdt2";
    const readingsRef = ref(db, `UsersData/${userId}/readings`);

    const unsubscribe = onValue(readingsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const parsed = Object.entries(data).map(([timestamp, sensors]) => ({
          timestamp,
          sensors: sensors as Record<string, SensorValues>
        }));
        setReadings(parsed);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {readings.map((reading) => (
        <div key={reading.timestamp} className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-bold mb-2">
            {new Date(parseInt(reading.timestamp) * 1000).toLocaleString()}
          </h3>
          {Object.entries(reading.sensors).map(([sensor, values]) => (
            <div key={sensor} className="mb-3">
              <h4 className="text-sm font-semibold">{sensor}</h4>
              <p>Temp: {values.temperature}°C</p>
              <p>Humidity: {values.humidity}%</p>
              <p>Pressure: {values.pressure}hPa</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}