import {
  WiCloudy,
  WiDayCloudy,
  WiDayCloudyHigh,
  WiDayShowers,
  WiDaySprinkle,
  WiDaySunny,
  WiFog,
  WiRain,
  WiRainMix,
  WiShowers,
  WiSleet,
  WiSnow,
  WiSnowflakeCold,
  WiSnowWind,
  WiSprinkle,
  WiThunderstorm,
  WiWindBeaufort0,
  WiWindBeaufort1,
  WiWindBeaufort10,
  WiWindBeaufort11,
  WiWindBeaufort12,
  WiWindBeaufort2,
  WiWindBeaufort3,
  WiWindBeaufort4,
  WiWindBeaufort5,
  WiWindBeaufort6,
  WiWindBeaufort7,
  WiWindBeaufort8,
  WiWindBeaufort9,
} from "react-icons/wi";
import { WeatherCodeNumber } from "@/lib/get-weather-forecast";

const svgProps = {
  className: "w-9 h-9",
};

export const weatherIcons: Record<WeatherCodeNumber, React.ReactNode> = {
  0: <WiDaySunny {...svgProps} />, // Clear
  1: <WiDayCloudyHigh {...svgProps} />, // Mainly clear
  2: <WiDayCloudy {...svgProps} />, // Partly cloudy
  3: <WiCloudy {...svgProps} />, // Overcast
  45: <WiFog {...svgProps} />, // Fog
  48: <WiSnowflakeCold {...svgProps} />, // Deposting rime
  51: <WiShowers {...svgProps} />, // Light drizzle
  53: <WiShowers {...svgProps} />, // Drizzle
  55: <WiRainMix {...svgProps} />, // Heavy drizzle
  56: <WiShowers {...svgProps} />, // Light freezing drizzle
  57: <WiRainMix {...svgProps} />, // Heavy freezing drizzle
  61: <WiShowers {...svgProps} />, // Light rain
  63: <WiRain {...svgProps} />, // Rain
  65: <WiRain {...svgProps} />, // Heavy rain
  66: <WiSleet {...svgProps} />, // Light freezing rain
  67: <WiSleet {...svgProps} />, // Heavy freezing rain
  71: <WiSprinkle {...svgProps} />, // Light snow
  73: <WiSnow {...svgProps} />, // Snow
  75: <WiSnowWind {...svgProps} />, // Heavy snow
  77: <WiSnow {...svgProps} />, // Snow grains
  80: <WiDayShowers {...svgProps} />, // Light  showers
  81: <WiShowers {...svgProps} />, // Showers
  82: <WiRainMix {...svgProps} />, // Heavy showers
  85: <WiDaySprinkle {...svgProps} />, // Light snow showers
  86: <WiDaySprinkle {...svgProps} />, // Snow showers
  95: <WiThunderstorm {...svgProps} />,
  96: <WiThunderstorm {...svgProps} />,
  99: <WiThunderstorm {...svgProps} />,
};

export const windIcons: Record<string, React.ReactNode> = {
  0: <WiWindBeaufort0 {...svgProps} />,
  1: <WiWindBeaufort1 {...svgProps} />,
  2: <WiWindBeaufort2 {...svgProps} />,
  3: <WiWindBeaufort3 {...svgProps} />,
  4: <WiWindBeaufort4 {...svgProps} />,
  5: <WiWindBeaufort5 {...svgProps} />,
  6: <WiWindBeaufort6 {...svgProps} />,
  7: <WiWindBeaufort7 {...svgProps} />,
  8: <WiWindBeaufort8 {...svgProps} />,
  9: <WiWindBeaufort9 {...svgProps} />,
  10: <WiWindBeaufort10 {...svgProps} />,
  11: <WiWindBeaufort11 {...svgProps} />,
  12: <WiWindBeaufort12 {...svgProps} />,
};
