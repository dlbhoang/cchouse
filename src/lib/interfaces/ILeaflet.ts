export interface IMapQueryString {
  z: number; // zoom
  lat: number;
  lng: number;
}

export interface IMyPoint {
  lat: number;
  lng: number;
}

export interface IPolygonProvince {
  id: string | number;
  points: IMyPoint[];
  color: string;
}

export interface IPolygonDistrict extends IPolygonProvince {
  provinceId: string | number;
}
