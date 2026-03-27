export interface IGeocode {
  results: IGeocodeItem[];
  status: string;
}

export interface IGeocodeItem {
  formatted_address: string;
  place_id: string;
  compound: Compound;
  geometry: Geometry;
}

interface Compound {
  province: string;
  district: string;
  commune: string;
}

interface Geometry {
  location: Location;
}

interface Location {
  lat: number;
  lng: number;
}
