const NAME_SWAPS = new Map<string, string>([["Tricia", "P"]]);

const splitName = (name: string) => {
  const names = name.split(" ");

  for (const nameSwap of NAME_SWAPS.keys()) {
    if (names.includes(nameSwap)) {
      names.splice(names.indexOf(nameSwap), 1, NAME_SWAPS.get(nameSwap) || "");
    }
  }

  const surname = names.pop()?.replaceAll("+", " ");

  return { forenames: names, surname };
};

export const initialiseName = (name: string) => {
  const { forenames, surname } = splitName(name);

  const initials = forenames.map((name) => name[0]).join(" ");
  return `${initials} ${surname}`;
};

export const monogramName = (name: string) => {
  const { forenames, surname } = splitName(name);

  return `${forenames[0]?.[0] ?? ""}${surname?.[0] ?? ""}`;
};
