export const FORECAST_TTL_FLOOR_MS = 10 * 60 * 1000;
export const FORECAST_TTL_CEILING_MS = 60 * 60 * 1000;

export const expiresToTtl = (expires: string | null, now: Date): number => {
  const expiresAt = expires ? Date.parse(expires) : Number.NaN;

  if (Number.isNaN(expiresAt)) return FORECAST_TTL_FLOOR_MS;

  return Math.min(
    Math.max(expiresAt - now.getTime(), FORECAST_TTL_FLOOR_MS),
    FORECAST_TTL_CEILING_MS,
  );
};
