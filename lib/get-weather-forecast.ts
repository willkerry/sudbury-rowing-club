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
  const url = "https://api.open-meteo.com/v1/forecast";
  const params = {
    latitude: CLUB_LOCATION[0],
    longitude: CLUB_LOCATION[1],
    daily:
      "weathercode,temperature_2m_max,windspeed_10m_max,winddirection_10m_dominant",
    timezone: "Europe/London",
  };
  return await axios
    .get<ForecastResponse>(url, { params })
    .then((res) => res.data);
};

/**
 * Converts mph windspeeds to the Beaufort scale, clumsily.
 */
const kphToBeaufort = (kph: number) => {
  switch (true) {
    case kph < 1:
      return 0;
    case kph < 6:
      return 1;
    case kph < 12:
      return 2;
    case kph < 20:
      return 3;
    case kph < 29:
      return 4;
    case kph < 39:
      return 5;
    case kph < 50:
      return 6;
    case kph < 62:
      return 7;
    case kph < 75:
      return 8;
    case kph < 89:
      return 9;
    case kph < 103:
      return 10;
    case kph < 118:
      return 11;
    default:
      return 12;
  }
};

/**
 * Converts a wind direction in degrees to a compass direction.
 */
const degreesToCardinal = (degrees: number) => {
  const directions = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
    "N",
  ];
  const index = Math.round(degrees / 22.5);
  return directions[index];
};

export interface Forecast {
  beaufort: number;
  code: WeatherCodeNumber;
  maxTemp: number;
  windDirection: number;
  windDirectionText: string;
  windSpeed: number;
  date: Date;
}

/**
 * Fetches the weather forecast for the club location and returns a Forecast
 * array for the next 7 days.
 */
const getWeatherForecast: () => Promise<Forecast[]> = async () => {
  const response = await fetchWeatherForecast();

  if (!response) {
    throw new Error("No response from Open Meteo API");
  }

  console.log("Fetcher Ran", { response });
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
      windDirectionText: degreesToCardinal(windDir[i]),
      beaufort: kphToBeaufort(wind[i]),
      date: time[i],
    });
  }

  return forecast;
};

export default getWeatherForecast;

export const getYRURL = (date: Date) => {
  let dayIndex = new Date(date).getDay();
  return `https://www.yr.no/en/forecast/hourly-table/2-2636564/Great%20Britain/England/Suffolk/Sudbury?i=${dayIndex}`;
};
