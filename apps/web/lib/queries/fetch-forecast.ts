import { CLUB_LOCATION } from "@/lib/constants";
import axios from "axios";
import { z } from "zod";

const ZWeatherCode = z.union([
  z.literal(0),
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(45),
  z.literal(48),
  z.literal(51),
  z.literal(53),
  z.literal(55),
  z.literal(56),
  z.literal(57),
  z.literal(61),
  z.literal(63),
  z.literal(65),
  z.literal(66),
  z.literal(67),
  z.literal(71),
  z.literal(73),
  z.literal(75),
  z.literal(77),
  z.literal(80),
  z.literal(81),
  z.literal(82),
  z.literal(85),
  z.literal(86),
  z.literal(95),
  z.literal(96),
  z.literal(99),
]);

const ZForecastResponse = z.object({
  daily: z.object({
    weathercode: z.array(ZWeatherCode),
    temperature_2m_max: z.array(z.number()),
    temperature_2m_min: z.array(z.number()),
    // Will be in form 2023-01-10
    time: z.array(z.string().transform((s) => new Date(s))),
    windspeed_10m_max: z.array(z.number()),
    winddirection_10m_dominant: z.array(z.number()),
  }),
});

const fetchWeatherForecast = async () => {
  const url = "https://api.open-meteo.com/v1/forecast";
  const params = {
    latitude: CLUB_LOCATION[0],
    longitude: CLUB_LOCATION[1],
    daily: [
      "weathercode",
      "temperature_2m_max",
      "temperature_2m_min",
      "windspeed_10m_max",
      "winddirection_10m_dominant",
    ],
    timezone: "Europe/London",
  };
  const res = await axios.get(url, { params }).then((res) => res.data);
  return ZForecastResponse.parse(res);
};

export default fetchWeatherForecast;
export type WeatherCodeNumber = z.infer<typeof ZWeatherCode>;
export type ForecastResponse = z.infer<typeof ZForecastResponse>;
