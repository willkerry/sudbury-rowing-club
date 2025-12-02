import type { WeatherCodeNumber } from "@sudburyrc/api";
import { fetchWeatherForecast } from "@sudburyrc/api";
import {
  type CardinalDirection,
  convertBearingToCardinal,
} from "./helpers/convertBearingToCardinal";
import { convertKphToBeaufort } from "./helpers/convertKphToBeaufort";

const lc = <T extends string>(s: T): Lowercase<T> =>
  s.toLowerCase() as Lowercase<T>;

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
const SNOW_SHOWERS = `${SNOW} ${lc(SHOWERS)}` as const;
const LIGHT_SNOW = `${LIGHT} ${lc(SNOW)}` as const;
const THUNDER = "Thunder";
const THUNDERSTORM = "Thunderstorm";

const FREEZING = "freezing";

const weatherCodes = {
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
} as const satisfies Record<WeatherCodeNumber, string>;

const briefWeatherCodes = {
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
  85: LIGHT_SNOW,
  86: LIGHT_SNOW,
  95: THUNDER,
  96: THUNDER,
  99: THUNDER,
} as const satisfies Record<WeatherCodeNumber, string>;

export type Forecast = {
  code: WeatherCodeNumber;
  condition: {
    full: (typeof weatherCodes)[WeatherCodeNumber];
    brief: (typeof briefWeatherCodes)[WeatherCodeNumber];
  };
  temp: {
    /** @format °C */
    max: number;
    /** @format °C */
    min: number;
  };
  wind: {
    /** @format Beaufort scale */
    speed: number;
    direction: CardinalDirection;
  };
  date: Date;
};

/**
 * Fetches the weather forecast for the club location and returns a Forecast
 * array for the next 7 days.
 */
export const getWeatherForecast = async (): Promise<Forecast[]> => {
  try {
    const { daily } = await fetchWeatherForecast();

    return daily.time.map((time, index) => ({
      code: daily.weathercode[index],
      condition: {
        full: weatherCodes[daily.weathercode[index]],
        brief: briefWeatherCodes[daily.weathercode[index]],
      },
      temp: {
        max: Math.round(daily.temperature_2m_max[index]),
        min: Math.round(daily.temperature_2m_min[index]),
      },
      wind: {
        speed: convertKphToBeaufort(daily.windspeed_10m_max[index]),
        direction: convertBearingToCardinal(
          daily.winddirection_10m_dominant[index],
        ),
      },
      date: time,
    }));
  } catch (err) {
    console.error(err);
    return [];
  }
};

const MET_OFFICE_BASE_URL =
  "https://www.metoffice.gov.uk/weather/forecast/u12809dqk#";

export const getMetOfficeURL = (date: Date) =>
  new URL(
    `${MET_OFFICE_BASE_URL}?date=${new Date(date).toISOString().slice(0, 10)}`,
  ).toString();
