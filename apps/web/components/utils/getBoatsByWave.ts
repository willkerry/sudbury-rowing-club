type OutputMap = {
  [key: string]: { x: string; y: string }[];
};

/**
 * Takes a matrix with headers and returns header value pairs for agglomerated value pairs.
 */
function getBoatsByWave(matrix: string[][], exclude?: string): OutputMap {
  const categories: string[] = matrix.map((value) => value[0]);
  const boats: string[] = matrix[0];
  const outputMap: OutputMap = {};

  matrix.forEach((row, x) => {
    if (!x) return;

    row.forEach((value, y) => {
      if (!y || !value || value === exclude) return;

      if (!outputMap[value]) outputMap[value] = [];

      outputMap[value].push({
        x: categories[x].toString(),
        y: boats[y].toString(),
      });
    });
  });

  for (const key in outputMap) {
    outputMap[key].sort((a, b) => {
      if (a.y < b.y) return -1;
      if (a.y > b.y) return 1;

      return 0;
    });
  }

  return outputMap;
}

export default getBoatsByWave;
