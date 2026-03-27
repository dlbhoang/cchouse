export interface ICustomerWebsiteRequest {
  FullName: string;
  Email: string;
  Phone: string;
  Address: string;
  Avatar: string;
  Gender: number | null;
  Requirement: string;
  AccountType: number;
  RefPhone: string;
  Dob: string;
  FacebookId: string | null;
}

export interface ICustomerWebsiteResponse extends ICustomerWebsiteRequest {
  Id: number;
  IsVerify: boolean;
  Account: {
    Username: string;
    Password: string | null;
    Salt: string;
    IsActive: boolean;
    IsFaceBookAcc: boolean;
    IsGmailAcc: boolean;
  };
  OldAccountId: string | null;
}
