import { useState, useEffect } from 'react';

export interface WeatherData {
  id: string;
  time: string;
  hour: number;
  temperature: number;
  humidity: number;
  rainChance: number;
  windSpeed: number;
  risk: 'low' | 'medium' | 'high';
}

export interface CurrentWeather {
  temperature: number;
  humidity: number;
  rainChance: number;
  windSpeed: number;
  condition: string;
  icon: string;
}

// Bến Tre coordinates
const LAT = 10.2433;
const LON = 106.3756;

function getRisk(rainChance: number, humidity: number): 'low' | 'medium' | 'high' {
  if (rainChance > 60) return 'high';
  if (rainChance > 30 || humidity > 70) return 'medium';
  return 'low';
}

function getCondition(rainChance: number, cloudCover: number): { condition: string; icon: string } {
  if (rainChance > 60) return { condition: 'Có mưa', icon: 'cloudrain' };
  if (rainChance > 30) return { condition: 'Có mây, khả năng mưa', icon: 'cloud' };
  if (cloudCover > 50) return { condition: 'Nhiều mây', icon: 'cloud' };
  return { condition: 'Nắng ráo', icon: 'sun' };
}

export function useWeather() {
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather>({
    temperature: 32,
    humidity: 55,
    rainChance: 15,
    windSpeed: 12,
    condition: 'Nắng ráo',
    icon: 'sun',
  });
  const [forecastData, setForecastData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const url =
          `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}` +
          `&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,wind_speed_10m,cloud_cover` +
          `&current=temperature_2m,relative_humidity_2m,precipitation_probability,wind_speed_10m,cloud_cover` +
          `&timezone=Asia%2FBangkok&forecast_days=1`;

        const res = await fetch(url);
        if (!res.ok) throw new Error('Không thể tải dữ liệu thời tiết');
        const data = await res.json();

        const cur = data.current;
        const { condition, icon } = getCondition(
          cur.precipitation_probability ?? 0,
          cur.cloud_cover ?? 0
        );
        setCurrentWeather({
          temperature: cur.temperature_2m,
          humidity: cur.relative_humidity_2m,
          rainChance: cur.precipitation_probability ?? 0,
          windSpeed: cur.wind_speed_10m,
          condition,
          icon,
        });

        const now = new Date();
        const times: string[] = data.hourly.time;
        const temps: number[] = data.hourly.temperature_2m;
        const humids: number[] = data.hourly.relative_humidity_2m;
        const rains: number[] = data.hourly.precipitation_probability;
        const winds: number[] = data.hourly.wind_speed_10m;

        const forecast: WeatherData[] = [];
        for (let i = 0; i < times.length && forecast.length < 12; i++) {
          if (new Date(times[i]) < now) continue;
          const hour = new Date(times[i]).getHours();
          forecast.push({
            id: `hour-${i}`,
            time: `${hour.toString().padStart(2, '0')}:00`,
            hour,
            temperature: Math.round(temps[i] * 10) / 10,
            humidity: Math.round(humids[i]),
            rainChance: Math.round(rains[i]),
            windSpeed: Math.round(winds[i] * 10) / 10,
            risk: getRisk(rains[i], humids[i]),
          });
        }

        setForecastData(forecast);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Lỗi không xác định');
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
    const interval = setInterval(fetchWeather, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return { currentWeather, forecastData, loading, error };
}
