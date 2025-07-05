const cardinalDirections = [
  "N",
  "NNE",
  "NE",
  "ENE",
  "E",
  "ESE",
  "SE",
  "SSE",
  "S",
  "SSW",
  "SW",
  "WSW",
  "W",
  "WNW",
  "NW",
  "NNW",
] as const;

export type CardinalDirection = (typeof cardinalDirections)[number];

/**
 * Converts a wind direction in degrees to a compass direction.
 */
export const convertBearingToCardinal = (
  degrees: number,
): CardinalDirection => {
  const normalisedBearing = ((degrees % 360) + 360) % 360;
  const index = Math.floor((normalisedBearing + 11.25) / 22.5) % 16;

  return cardinalDirections[index];
};
