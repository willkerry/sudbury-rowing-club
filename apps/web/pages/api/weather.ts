import getWeatherForecast from "@/lib/get-weather-forecast";
import type { NextApiRequest, NextApiResponse } from "next";

const weather = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    res.status(405);
    return;
  }

  res.setHeader("Cache-Control", "public, s-maxage=3600");

  try {
    const status = await getWeatherForecast();
    res.status(200).json(status);
  } catch (_error: any) {
    res.status(500);
  }
};

export default weather;
