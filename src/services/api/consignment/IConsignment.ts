/**
 * Consignment_Post Request
 *
 * cchouse.Domain.Dtos.Consignment.ConsignmentRequest
 */
interface IConsignmentRequest {
  Address: string;
  ContactEmail?: string;
  ContactName?: string;
  ContactNotes?: string;
  ContactPhone: string;
  ContactType: number;
  Descriptions?: string;
  Id?: number;
  Images?: string[];
  PropTypeId: number;
  RentPrice?: number;
  SellPrice?: number;
  TransTypes: number[];
  Video?: string;
}

export interface IConsignmentResponse extends IConsignmentRequest {
  TransTypeName: string[];
  ContactTypeName: string;
  PropTypeName: string;
  CreatedDate: string;
}
