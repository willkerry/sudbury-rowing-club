import { NextApiRequest, NextApiResponse } from "next";
import getSafetyStatus from "@/lib/get-safety-status";

const safety = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    res.status(405);
    return;
  }

  res.setHeader("Cache-Control", "public, s-maxage=3600");

  try {
    const status = await getSafetyStatus();
    res.status(200).json(status);
  } catch (error: any) {
    res.status(500);
  }
};

export default safety;
