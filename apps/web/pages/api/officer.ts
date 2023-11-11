import { fuzzyGetOfficer } from "@/lib/fuzzy-get-officer";
import { NextApiRequest, NextApiResponse } from "next";

/** Given a string (an officer name or role, possible incomplete), returns the ID of the most probably officer */
const vague = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    res.status(405);
    return;
  }

  const { q } = req.query as { q: string };

  if (!q) {
    res.status(400);
    return;
  }

  const mostPropableOfficer = await fuzzyGetOfficer(q);

  res.setHeader("Cache-Control", "public, s-maxage=60");
  res.json(mostPropableOfficer);
};

export default vague;
