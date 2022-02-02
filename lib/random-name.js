import names from "@/data/wodehouse";

export default function getRandomName() {
  const name = names[Math.floor(Math.random() * names.length)];
  const email = `${name[0]}@${name[1]}.com`.toLowerCase();
  return [`${name[0]} ${name[1]}`, email];
}
