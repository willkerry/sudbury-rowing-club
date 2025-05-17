const NAME_SWAPS = new Map<string, string>([["Tricia", "P"]]);

export const initialiseName = (name: string) => {
  const names = name.split(" ");

  for (const nameSwap of NAME_SWAPS.keys()) {
    if (names.includes(nameSwap)) {
      names.splice(names.indexOf(nameSwap), 1, NAME_SWAPS.get(nameSwap) || "");
    }
  }

  const surname = names.pop()?.replace("+", " ");

  const initials = names.map((name) => name[0]).join(" ");
  return `${initials} ${surname}`;
};
