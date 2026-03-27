const admin = '/admin';
const website = '/website';

const DashboardRoutes = {
  dashboard: { url: `${admin}/dashboard/overview`, name: 'Thống kê tổng quan' },
  reportSpam: {
    url: `${admin}/dashboard/report-spam`,
    name: 'Báo xấu tin đăng',
  },
  consignment: {
    url: `${admin}/dashboard/consignment`,
    name: 'Ký gửi bất động sản',
  },
  report: { url: `${admin}/dashboard/report`, name: 'Báo cáo doanh thu' },
  userStatus: { url: '/user-status', name: 'Tình hình nhân sự' },
};

const ModeratedRoutes = {
  propTransfer: {
    url: `${admin}/prop-transfer`,
    name: 'Thay đổi người nhập BĐS',
  },
  verifyProperty: {
    url: `${admin}/verify-property`,
    name: 'Kiểm duyệt bất động sản',
  },
};

const WebstiteRoutes = {};

export const AppRoutes = {
  ...DashboardRoutes,
  ...WebstiteRoutes,
  ...ModeratedRoutes,
  home: { url: '/', name: 'Trang chủ' },
  login: { url: '/login', name: 'Đăng nhập' },
  //
  userAdmin: { url: `${admin}/userAdmin`, name: 'Nhân sự' },
  leaveRequest: {
    url: `${admin}/userAdmin/leave-request`,
    name: 'Đặt lịch nghỉ phép',
  },

  activity: { url: `${admin}/activity`, name: 'Lịch sử hoạt động' },
  customer: { url: `${admin}/customer`, name: 'Khách hàng' },
  userWebsite: {
    url: `${admin}/customer${website}`,
    name: 'Đăng ký thành viên',
  },

  sim: { url: `${admin}/sim`, name: 'Sim điện thoại' },

  // Property group
  property: { url: `${admin}/property`, name: 'Bất động sản' },
  propTemp: {
    url: `${admin}/propTemp`,
    name: 'BĐS ngoài',
  },
  apartment: { url: `${admin}/apartment`, name: 'Danh sách chung cư' },
  apartmentUnit: { url: `${admin}/apartment/unit`, name: 'Quản lý chung cư' },

  propCompare: {
    url: `${admin}/property/propCompare`,
    name: 'So sánh bất động sản',
  },

  //
  map: { url: `${admin}/map`, name: 'Bản đồ' },

  //feed
  feed: { url: `${admin}/feed`, name: 'Nội bộ' },
  feedWebsite: { url: `${admin}/feed${website}`, name: 'Khách hàng' },
  feedPricing: {
    url: `${admin}/feed/pricing`,
    name: 'Biểu phí',
  },

  // config group
  config: { url: `${admin}/config`, name: 'Cài đặt chung' },
  branch: { url: `${admin}/config/branch`, name: 'Chi nhánh' },
  notifications: { url: `${admin}/config/notifications`, name: 'Thông báo' },
  document: { url: `${admin}/config/document`, name: 'Văn bản' },
  propType: { url: `${admin}/config/propType`, name: 'Loại bất động sản' },

  news: { url: `${admin}/config/news`, name: 'Quản lý tin tức' },
  recruitment: { url: `${admin}/config/recruitment`, name: 'Tuyển dụng' },
  role: { url: `${admin}/config/role`, name: 'Chức vụ & Quyền' },
  address: { url: `${admin}/config/address`, name: 'Địa chỉ' },

  rule: { url: `${admin}/rule`, name: 'Thời gian làm việc' },
  trangPhuc: { url: `${admin}/trang-phuc`, name: 'Trang phục đi làm' },
  marketing: { url: `${admin}/marketing`, name: 'Marketing' },
  suDung: { url: `${admin}/su-dung`, name: 'Sử dụng phần mềm' },
  hoaHongBan: { url: `${admin}/hoa-hong-nha-ban`, name: 'Hoa hồng nhà bán' },
  hoaHongThue: { url: `${admin}/hoa-hong-nha-thue`, name: 'Hoa hồng nhà thuê' },
};
