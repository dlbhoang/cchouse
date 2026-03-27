import { Dayjs } from 'dayjs';

/**
 * Recruitment_Post Request
 *
 * cchouse.Domain.Dtos.Recruitment.RecruitmentRequest
 */
export interface IRecruitmentRequest {
  BeginDate?: string;
  Benefit?: string;
  ContactAddress?: string;
  ContactEmail?: string;
  ContactPhone?: string;
  Content?: string;
  EndDate?: string;
  Files?: string;
  FromSalary?: number;
  Id?: number;
  IsHidden?: boolean;
  Places?: string[];
  Quantity?: number;
  Requirement?: string;
  Role?: string;
  Status?: number;
  ToSalary?: number;
  Age?: string;
  Education?: number;
  Gender?: number;
  //for UI handle
  DateRangeValues: [Dayjs, Dayjs];
}

export interface IRecruitmentResponse extends IRecruitmentRequest {
  StatusName: string;
  CandidateCount: number;
}

export interface ICandidate {
  ApplyDate: string;
  IsRead: boolean;
  Id: number;
  FullName: string;
  Phone: string;
  Email?: string;
  CVFile: string;
}
