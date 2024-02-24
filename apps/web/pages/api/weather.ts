import { NextApiRequest, NextApiResponse } from "next";
import getWeatherForecast from "@/lib/get-weather-forecast";

const weather = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    res.status(405);
    return;
  }

  res.setHeader("Cache-Control", "public, s-maxage=3600");

  try {
    const status = await getWeatherForecast();
    res.status(200).json(status);
  } catch (error: any) {
    res.status(500);
  }
};

export default weather;
