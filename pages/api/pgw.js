import getRandomName from "@/lib/random-name";

export default function handler(req, res) {
  const name = getRandomName();
  res.status(200).json(name);
}
