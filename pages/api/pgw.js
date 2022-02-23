import getRandomName from "@/lib/random-name";

export default function handler(req, res) {
  if (req.method === "POST") {
    const name = getRandomName();
    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ name: name[0], email: name[1] });
  } else {
    res.status(404).end();
  }
}
