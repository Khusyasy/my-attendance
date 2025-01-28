export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const toRad = (value: number) => (value * Math.PI) / 180;

  const R = 6371000; // Radius of the Earth in meters
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in meters

  return distance;
};

export const isWithinRadius = (
  userLat: number,
  userLon: number,
  userAccuracy: number,
  sessionLat: number,
  sessionLon: number,
  sessionRadius: number,
): boolean => {
  const distance = calculateDistance(userLat, userLon, sessionLat, sessionLon);

  const effectiveRadius = sessionRadius + userAccuracy;

  return distance <= effectiveRadius;
};
