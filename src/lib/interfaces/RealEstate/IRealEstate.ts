export interface IRealEstateRequest {
  id: number;
  transType: 'sell' | 'rent';
  senderName: string;
  senderPhone: string[];
  price: number;
  unit: string;
  images: string[];
  note: string;
  status: string;
}

export interface IRealEstateResponse extends IRealEstateRequest {
  createdBy: string;
  createdDate: string;
}
