import { getWodehouseFullDetails } from "get-wodehouse-name";
import type { NextApiRequest, NextApiResponse } from "next";

const wodehouse = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    res.status(405);
    return;
  }

  res.setHeader("Cache-Control", "public, s-maxage=60");

  try {
    const status = getWodehouseFullDetails();
    res.status(200).json(status);
  } catch (_error: any) {
    res.status(500);
  }
};

export default wodehouse;
