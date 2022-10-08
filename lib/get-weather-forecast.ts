import axios from "axios";
import { CLUB_LOCATION } from "./constants";

// prettier-ignore
export type WeatherCodeNumber = 0 |  1 |  2 |  3 |
                                            45 |           48 |
                             51 |      53 | 55 | 56 | 57 |
                             61 |      63 | 65 | 66 | 67 |
                             71 |      73 | 75 |      77 |
                        80 | 81 | 82 |      85 | 86 |
                                            95 | 96 |           99;

// prettier-ignore
export const weatherCodes: Record<WeatherCodeNumber, string> = {
   0: "Clear",
   1: "Mainly clear",
   2: "Partly cloudy",
   3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  56: "Light freezing drizzle",
  57: "Dense freezing drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  66: "Light freezing rain",
  67: "Heavy freezing rain",
  71: "Slight snow",
  73: "Moderate snow",
  75: "Heavy snow",
  77: "Snow grains",
  80: "Light showers",
  81: "Moderate showers",
  82: "Heavy showers",
  85: "Light snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm",
  99: "Thunderstorm",
};

interface ForecastResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  daily_units: {
    time: string;
    weathercode: string;
  };
  daily: {
    temperature_2m_max: number[];
    time: Date[];
    weathercode: WeatherCodeNumber[];
    windspeed_10m_max: number[];
    winddirection_10m_dominant: number[];
  };
}

/**
 * Fetches the weather forecast for the club location.
 */
const fetchWeatherForecast = async () => {
  let url = [`https://api.open-meteo.com/v1/forecast`];
  url.push(`?latitude=${CLUB_LOCATION[0]}`);
  url.push(`&longitude=${CLUB_LOCATION[1]}`);
  url.push(
    `&daily=weathercode,temperature_2m_max,windspeed_10m_max,winddirection_10m_dominant`
  );
  url.push(`&timezone=Europe/London`);

  const response = await axios
    .get<ForecastResponse>(url.join(""))
    .then((res) => res.data);
  console.log(response);
  return response;
};

/**
 * Converts mph windspeeds to the Beaufort scale, clumsily.
 */
const mphToBeaufort = (mph: number) => {
  if (mph < 1) {
    return 0;
  } else if (mph < 4) {
    return 1;
  } else if (mph < 8) {
    return 2;
  } else if (mph < 13) {
    return 3;
  } else if (mph < 19) {
    return 4;
  } else if (mph < 25) {
    return 5;
  } else if (mph < 32) {
    return 6;
  } else if (mph < 39) {
    return 7;
  } else if (mph < 47) {
    return 8;
  } else if (mph < 55) {
    return 9;
  } else if (mph < 64) {
    return 10;
  } else if (mph < 74) {
    return 11;
  } else {
    return 12;
  }
};

export interface Forecast {
  beaufort: number;
  code: WeatherCodeNumber;
  maxTemp: number;
  windDirection: number;
  windSpeed: number;
  date: Date;
}

/**
 * Fetches the weather forecast for the club location and returns a Forecast
 * array for the next 7 days.
 */
const getWeatherForecast: () => Promise<Forecast[]> = async () => {
  const response = await fetchWeatherForecast();
  console.log(response);
  const {
    time,
    weathercode,
    temperature_2m_max: temp,
    windspeed_10m_max: wind,
    winddirection_10m_dominant: windDir,
  } = response.daily;

  const forecast: Forecast[] = [];

  for (let i = 0; i < time.length; i++) {
    forecast.push({
      code: weathercode[i],
      maxTemp: Math.round(temp[i]),
      windSpeed: Math.round(wind[i]),
      windDirection: windDir[i],
      beaufort: mphToBeaufort(wind[i]),
      date: time[i],
    });
  }

  return forecast;
};

export default getWeatherForecast;
