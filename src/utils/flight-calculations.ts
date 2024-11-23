const EARTH_RADIUS = 6371;

export type Coordinates = {
  lat: number;
  lng: number;
};
export const calculateDistance = (from: Coordinates, to: Coordinates): number => {
  const dLat = toRad(to.lat - from.lat);
  const dLon = toRad(to.lng - from.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(from.lat)) *
      Math.cos(toRad(to.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = EARTH_RADIUS * c;

  return Math.round(distance);
};
const toRad = (degrees: number): number => {
  return (degrees * Math.PI) / 180;
};
export const calculateFlightTime = (distanceKm: number): { hours: number; minutes: number } => {
  const AVG_SPEED = 800;
  const totalHours = distanceKm / AVG_SPEED + 0.5;

  const hours = Math.floor(totalHours);
  const minutes = Math.round((totalHours - hours) * 60);

  return { hours, minutes };
};

export const formatFlightTime = (time: { hours: number; minutes: number }): string => {
  if (time.hours === 0) {
    return `${time.minutes}m`;
  }
  return time.minutes > 0 ? `${time.hours}h ${time.minutes}m` : `${time.hours}h`;
};