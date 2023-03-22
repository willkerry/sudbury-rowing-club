import getSafetyStatus from "@/lib/get-safety-status";
import { NextApiRequest, NextApiResponse } from "next";

const safety = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    res.status(405);
    return;
  }

  res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate");

  try {
    const status = await getSafetyStatus();
    res.status(200).json(status);
  } catch (error: any) {
    res.status(500);
  }
};

export default safety;
