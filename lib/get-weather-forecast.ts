import fetchWeatherForecast, {
  WeatherCodeNumber,
} from "@/lib/queries/fetch-forecast";

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

enum CardinalDirection {
  N,
  NNE,
  NE,
  ENE,
  E,
  ESE,
  SE,
  SSE,
  S,
  SSW,
  SW,
  WSW,
  W,
  WNW,
  NW,
  NNW,
}

/**
 * Converts mph windspeeds to the Beaufort scale, clumsily.
 */
const kphToBeaufort = (kph: number) => {
  switch (true) {
    case isNaN(kph):
      throw new Error("kph is not a number");
    case kph < 0:
      throw new Error("kph is negative");
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

const degreesToInt = (degrees: number) => {
  if (degrees < 0 || degrees >= 360) {
    throw new Error("degrees must be in the range [0, 360)");
  }
  return Math.round(degrees / 22.5) % 16;
};

const intToCardinal = (int: number): CardinalDirection => {
  if (int < 0 || int > 15) throw new Error("Invalid integer");
  return CardinalDirection[Math.round(int)] as unknown as CardinalDirection;
};

/**
 * Converts a wind direction in degrees to a compass direction.
 */
const degreesToCardinal = (degrees: number) => {
  const int = degreesToInt(degrees);
  return intToCardinal(int);
};

type Forecast = {
  code: WeatherCodeNumber;
  maxTemp: number;
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

    return daily.time.map((time, index) => {
      return {
        code: daily.weathercode[index],
        maxTemp: Math.round(daily.temperature_2m_max[index]),
        windSpeed: daily.windspeed_10m_max[index],
        windDirection: daily.winddirection_10m_dominant[index],
        windDirectionText: degreesToCardinal(
          daily.winddirection_10m_dominant[index]
        ),
        beaufort: kphToBeaufort(daily.windspeed_10m_max[index]),
        date: time,
      };
    });
  } catch (err) {
    console.error(err);
    return [];
  }
};

export default getWeatherForecast;

const BASE_URL = "https://www.yr.no/";

export const getYRURL = (date: Date) => {
  let i = new Date(date).getDay() + 1;
  if (i === 7) i = 0;

  const url = new URL(BASE_URL);
  url.pathname =
    "en/forecast/hourly-table/2-2636564/Great%20Britain/England/Suffolk/Sudbury";
  url.searchParams.append("i", i.toString());

  return url.toString();
};
