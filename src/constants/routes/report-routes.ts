const base = 'BIReport';

export const reportRoutes = {
  getPropSummary: `${base}/Prop/Summary`,
  getPropTransferSummary: `${base}/PropTransfer/Summary`,

  getTopUserInputProps: `${base}/Emp/GetTopInputProps`,
  getTopUserByActivity: `${base}/Emp/GetTopUserByActivity`,
  getTopUserInputFeed: `${base}/Emp/GetTopUserInputFeed`,

  getFeedSummary: `${base}/Feed/Summary`,
  getTopViewedFeedSummary: `${base}/Feed/GetTopViewedFeedSummary`,
  getTopViewedFeedDetails: `${base}/Feed/GetTopViewedFeedDetails`,

  getCustomerSummary: `${base}/Customer/Summary`,
  getCustomerDemandSummary: `${base}/CustomerDemand/Summary`,
} as const;
