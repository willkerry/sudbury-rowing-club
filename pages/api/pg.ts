import { getWodehouseFullDetails } from "get-wodehouse-name";
import { NextApiRequest, NextApiResponse } from "next";

const wodehouse = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    res.status(405);
    return;
  }

  res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate");

  try {
    const status = getWodehouseFullDetails();
    res.status(200).json(status);
  } catch (error: any) {
    res.status(500);
  }
};

export default wodehouse;
