/**
 * ReportSpam_Post Request
 *
 * cchouse.Domain.Dtos.ReportSpams.ReportSpamRequest
 */
interface IReportSpamRequest {
  Descriptions?: string;
  FeedId?: number;
  Id?: number;
  ReporterEmail?: string;
  ReporterName?: string;
  ReporterPhone?: string;
  SpamTypes?: number[];
}

export interface IReportSpamResponse extends IReportSpamRequest {
  SpamTypeNames: string[];
  CreatedDate: string;
}
