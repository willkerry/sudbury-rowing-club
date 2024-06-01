import type { WeatherCodeNumber } from "@sudburyrc/api";
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
  WiSnowWind,
  WiSnowflakeCold,
  WiSprinkle,
  WiThunderstorm,
  WiWindBeaufort0,
  WiWindBeaufort1,
  WiWindBeaufort2,
  WiWindBeaufort3,
  WiWindBeaufort4,
  WiWindBeaufort5,
  WiWindBeaufort6,
  WiWindBeaufort7,
  WiWindBeaufort8,
  WiWindBeaufort9,
  WiWindBeaufort10,
  WiWindBeaufort11,
  WiWindBeaufort12,
} from "react-icons/wi";

const svgProps = {
  className: "w-7 h-7",
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

const windSvgProps = {
  className: "w-8 h-8",
};

export const windIcons: Record<string, React.ReactNode> = {
  0: <WiWindBeaufort0 {...windSvgProps} />,
  1: <WiWindBeaufort1 {...windSvgProps} />,
  2: <WiWindBeaufort2 {...windSvgProps} />,
  3: <WiWindBeaufort3 {...windSvgProps} />,
  4: <WiWindBeaufort4 {...windSvgProps} />,
  5: <WiWindBeaufort5 {...windSvgProps} />,
  6: <WiWindBeaufort6 {...windSvgProps} />,
  7: <WiWindBeaufort7 {...windSvgProps} />,
  8: <WiWindBeaufort8 {...windSvgProps} />,
  9: <WiWindBeaufort9 {...windSvgProps} />,
  10: <WiWindBeaufort10 {...windSvgProps} />,
  11: <WiWindBeaufort11 {...windSvgProps} />,
  12: <WiWindBeaufort12 {...windSvgProps} />,
};
