/** Resolves to e.g. "Alice Alison and Bob Bobson", or null when a role has no occupants. */
export const OCCUPANT_NAMES = `select(count(occupants) > 0 => array::join(occupants[]->{"n": firstName + " " + surname}.n, " and "))`;
