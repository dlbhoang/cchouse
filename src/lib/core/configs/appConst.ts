import { ISearchOptions } from "@/lib/interfaces/filter/ISearchOptions";

export const appRegex = {
  PHONE: /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/,
  CONTENT: /^[a-zA-Z0-9\u0080-\uFFFF ,.=:;()_!&*?-]*$/,
  PASSWORD:
    /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1}).*$/,
};
export const appConst = {
  MANAGER_ROLES: [1, 2],

  TEXT_DEFAULT: "Chưa cập nhật",
  ARR_DAYS_FEED: [1, 3, 7, 15, 30, 45, 60, 90], // Số ngày đăng tin
  TIME_FORMAT: "HH:mm",
  DATE_TIME_FORMAT: "DD-MM-YYYY HH:mm:ss",
  DATE_FORMAT: "DD-MM-YYYY",
  DAY_MONTH_FORMAT: "DD-MM",
  SUBMIT_DATE_FORMAT: "YYYY-MM-DD",

  PROP_STATUS_COLORS: [
    "#007BFF",
    "#89bf04",
    "#DC3545",
    "#FFC107",
    "orange",
    "",
    "#6C757D",
  ],

  DATA_FEED_FAKE: {
    Property: {
      AdsType: 1,
      PropertyType: "3",
      Location: "2",
      DistrictId: "2",
      WardId: "19",
      StreetId: "3955",
      TotalArea: 3213,
      Price: "21312300000",
    },
    ProvinceId: "1",
    Title: "Nhà mặt tiền Nguyễn Trãi Q.1, diện tích 200m2, 2 phòng ngủ",
    Content:
      "Nên có: Loại nhà ở, vị trí, tiện ích, diện tích, số phòng, thông tin pháp lý, nội thất, v.v. Ví dụ: Nhà mặt tiền số 58 Phan Chu Trinh, Q.Bình Thạnh, 120m2. Khu dân cư an ninh. Giấy tờ chính chủ.",
    FeedPricingId: "6",
    Days: 7,
    StartDate: "2023-06-13",
  },
};

export const baseFilter: ISearchOptions = {
  pageIndex: 1,
  pageSize: 30,
};
