export function formatCoords(latitude, longitude) {
  const f = 100000; // Used to fix number of decimals
  const lat = Math.round(latitude * f) / f;
  const lon = Math.round(longitude * f) / f;
  const latLabel = lat >= 0 ? "N" : "S";
  const lonLabel = lon >= 0 ? "E" : "W";
  return `${lat} ${latLabel} ${lon} ${lonLabel}`;
}
