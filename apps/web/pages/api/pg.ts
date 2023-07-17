import { getWodehouseFullDetails } from "get-wodehouse-name";
import { NextApiRequest, NextApiResponse } from "next";

const wodehouse = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    res.status(405);
    return;
  }

  res.setHeader("Cache-Control", "public, s-maxage=60");

  try {
    const status = getWodehouseFullDetails();
    res.status(200).json(status);
  } catch (error: any) {
    res.status(500);
  }
};

export default wodehouse;
