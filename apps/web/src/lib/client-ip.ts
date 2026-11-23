export const getClientIp = (headers: Headers): string | undefined =>
  headers.get("cf-connecting-ip") ??
  (headers.get("x-forwarded-for")?.split(",")[0]?.trim() || undefined);
