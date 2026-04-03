export function formatCoords(latitude, longitude) {
  const f = 100000; // Used to fix number of decimals
  const lat = Math.round(latitude * f) / f;
  const lon = Math.round(longitude * f) / f;
  const latLabel = lat >= 0 ? "N" : "S";
  const lonLabel = lon >= 0 ? "E" : "W";
  return `${lat} ${latLabel} ${lon} ${lonLabel}`;
}

export function formatHeading(degrees) {
  if (degrees >= 0 && degrees <= 360) {
    return `${degrees}°`;
  } else {
    return "";
  }
}

export function formatDistance(meters) {
  if (meters >= 5000) {
    return `${(meters / 1000).toFixed(1)} km`;
  } else if (meters >= 1000) {
    return `${meters / 1000} km`;
  } else {
    return `${meters} m`;
  }
}

/**
 * Calculate distance (meters) and heading (degrees) between two WGS84 coordinate pairs.
 */
export function calculateDistanceAndHeading(from, to) {
  const R = 6371e3; // Earth radius in meters
  const lat1 = from.latitude;
  const lon1 = from.longitude;
  const lat2 = to.latitude;
  const lon2 = to.longitude;
  const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  // Haversine formula for distance
  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = Math.round(R * c);

  // Bearing formula
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  let heading = (Math.atan2(y, x) * 180) / Math.PI;
  heading = Math.round((heading + 360) % 360); // Normalize to 0-360

  return { distance, heading };
}
