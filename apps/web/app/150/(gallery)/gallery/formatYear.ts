export const formatYear = (dateString: string | null, range: number | null) => {
  if (!dateString) return "";

  const year = new Date(dateString)?.getFullYear();

  if (range) return `c. ${year - range}–${year + range}`;
  return String(year);
};
