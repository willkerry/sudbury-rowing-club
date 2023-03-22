import getWeatherForecast from "@/lib/get-weather-forecast";
import { NextApiRequest, NextApiResponse } from "next";

const weather = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    res.status(405);
    return;
  }

  res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate");

  try {
    const status = await getWeatherForecast();
    res.status(200).json(status);
  } catch (error: any) {
    res.status(500);
  }
};

export default weather;
