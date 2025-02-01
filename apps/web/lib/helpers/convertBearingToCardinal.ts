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
export const convertBearingToCardinal = (degrees: number): CardinalDirection =>
  intToCardinal(degreesToInt(degrees));

function degreesToInt(degrees: number) {
  if (degrees < 0 || degrees >= 360) {
    throw new Error("degrees must be in the range [0, 360)");
  }

  return Math.round(degrees / 22.5) % 16;
}

function intToCardinal(int: number): CardinalDirection {
  if (int < 0 || int > 15) throw new Error("Invalid integer");

  return cardinalDirections[Math.round(int)];
}
