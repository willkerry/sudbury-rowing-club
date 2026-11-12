type OutputMap = {
  [key: string]: { x: string; y: string }[];
};

/**
 * Takes a matrix with headers and returns header value pairs for agglomerated value pairs.
 */
export function getBoatsByWave(
  matrix: string[][],
  exclude?: string,
): OutputMap {
  const categories: string[] = matrix.map((value) => value[0]);
  const boats: string[] = matrix[0];
  const outputMap: OutputMap = {};

  for (const [x, row] of matrix.entries()) {
    if (!x) continue;

    for (const [y, value] of row.entries()) {
      if (!(y && value) || value === exclude) continue;

      if (!outputMap[value]) outputMap[value] = [];

      outputMap[value].push({
        x: categories[x].toString(),
        y: boats[y].toString(),
      });
    }
  }

  for (const key in outputMap) {
    outputMap[key].sort((a, b) => {
      if (a.y < b.y) return -1;
      if (a.y > b.y) return 1;

      return 0;
    });
  }

  return outputMap;
}
