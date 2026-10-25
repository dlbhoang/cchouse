export const hasMapCoordinates = (address?: {
  Lat?: number | null;
  Lng?: number | null;
}): address is { Lat: number; Lng: number } => {
  const lat = address?.Lat;
  const lng = address?.Lng;
  return (
    typeof lat === "number" &&
    typeof lng === "number" &&
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    Math.abs(lat) <= 90 &&
    Math.abs(lng) <= 180 &&
    (lat !== 0 || lng !== 0)
  );
};
