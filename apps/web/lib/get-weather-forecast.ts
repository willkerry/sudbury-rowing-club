import { fetchWeatherForecast } from "@sudburyrc/api";
import type { WeatherCodeNumber } from "@sudburyrc/api";
import {
  type CardinalDirection,
  convertBearingToCardinal,
} from "./helpers/convertBearingToCardinal";
import { convertKphToBeaufort } from "./helpers/convertKphToBeaufort";

const lc = (s: string) => s.toLowerCase();

const CLEAR = "Clear";
const CLOUDY = "Cloudy";
const DENSE = "Dense";
const DRIZZLE = "Drizzle";
const FOG = "Fog";
const HEAVY = "Heavy";
const LIGHT = "Light";
const MODERATE = "Moderate";
const OVERCAST = "Overcast";
const RAIN = "Rain";
const SHOWERS = "Showers";
const SLIGHT = "Slight";
const SNOW = "Snow";
const SNOW_SHOWERS = `${SNOW} ${SHOWERS}`;
const THUNDER = "Thunder";
const THUNDERSTORM = "Thunderstorm";

const FREEZING = "freezing";

export const weatherCodes: Record<WeatherCodeNumber, string> = {
  0: CLEAR,
  1: `Mainly ${lc(CLEAR)}`,
  2: `Partly ${lc(CLOUDY)}`,
  3: OVERCAST,
  45: FOG,
  48: `Depositing rime ${lc(FOG)}`,
  51: `${LIGHT} ${lc(DRIZZLE)}`,
  53: `${MODERATE} ${lc(DRIZZLE)}`,
  55: `${DENSE} ${lc(DRIZZLE)}`,
  56: `${LIGHT} ${FREEZING} ${lc(DRIZZLE)}`,
  57: `${DENSE} ${FREEZING} ${lc(DRIZZLE)}`,
  61: `${SLIGHT} ${lc(RAIN)}`,
  63: `${MODERATE} ${lc(RAIN)}`,
  65: `${HEAVY} ${lc(RAIN)}`,
  66: `${LIGHT} ${FREEZING} ${lc(RAIN)}`,
  67: `${HEAVY} ${FREEZING} ${lc(RAIN)}`,
  71: `${SLIGHT} ${lc(SNOW)}`,
  73: `${MODERATE} ${lc(SNOW)}`,
  75: `${HEAVY} ${lc(SNOW)}`,
  77: `${SNOW} grains`,
  80: `${LIGHT} ${lc(SHOWERS)}`,
  81: `${MODERATE} ${lc(SHOWERS)}`,
  82: `${HEAVY} ${lc(SHOWERS)}`,
  85: `${LIGHT} ${lc(SNOW_SHOWERS)}`,
  86: `${HEAVY} ${lc(SNOW_SHOWERS)}`,
  95: THUNDERSTORM,
  96: THUNDERSTORM,
  99: THUNDERSTORM,
};

export const briefWeatherCodes: Record<WeatherCodeNumber, string> = {
  0: CLEAR,
  1: CLEAR,
  2: CLEAR,
  3: OVERCAST,
  45: FOG,
  48: FOG,
  51: DRIZZLE,
  53: DRIZZLE,
  55: DRIZZLE,
  56: DRIZZLE,
  57: DRIZZLE,
  61: RAIN,
  63: RAIN,
  65: RAIN,
  66: RAIN,
  67: RAIN,
  71: SNOW,
  73: SNOW,
  75: SNOW,
  77: SNOW,
  80: SHOWERS,
  81: SHOWERS,
  82: SHOWERS,
  85: SNOW_SHOWERS,
  86: SNOW_SHOWERS,
  95: THUNDER,
  96: THUNDER,
  99: THUNDER,
};

type Forecast = {
  code: WeatherCodeNumber;
  maxTemp: number;
  minTemp: number;
  windSpeed: number;
  windDirection: number;
  windDirectionText: CardinalDirection;
  beaufort: number;
  date: Date;
};

/**
 * Fetches the weather forecast for the club location and returns a Forecast
 * array for the next 7 days.
 */
const getWeatherForecast = async (): Promise<Forecast[]> => {
  try {
    const { daily } = await fetchWeatherForecast();

    return daily.time.map((time, index) => ({
      code: daily.weathercode[index],
      maxTemp: Math.round(daily.temperature_2m_max[index]),
      minTemp: Math.round(daily.temperature_2m_min[index]),
      windSpeed: daily.windspeed_10m_max[index],
      windDirection: daily.winddirection_10m_dominant[index],
      windDirectionText: convertBearingToCardinal(
        daily.winddirection_10m_dominant[index],
      ),
      beaufort: convertKphToBeaufort(daily.windspeed_10m_max[index]),
      date: time,
    }));
  } catch (err) {
    console.error(err);
    return [];
  }
};

export default getWeatherForecast;

const MET_OFFICE_BASE_URL =
  "https://www.metoffice.gov.uk/weather/forecast/u12809dqk#";

export const getMetOfficeURL = (date: Date) =>
  new URL(
    `${MET_OFFICE_BASE_URL}?date=${new Date(date).toISOString().slice(0, 10)}`,
  ).toString();
