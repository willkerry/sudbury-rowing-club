import slugify from "slugify";

export type Slugger = (input: string) => string;

export function createSlugger(): Slugger {
  const used = new Map<string, number>();
  let placeholderCount = 0;

  return (input: string) => {
    const base = slugify(input, { lower: true, strict: true, trim: true });
    const candidate = base || `notice-${++placeholderCount}`;
    const count = used.get(candidate) ?? 0;
    used.set(candidate, count + 1);

    return count === 0 ? candidate : `${candidate}-${count + 1}`;
  };
}
