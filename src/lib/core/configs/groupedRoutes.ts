import {
  CogIcon,
  FileTextIcon,
  HouseIcon,
  UsersIcon,
  ChartBarIcon,
  ContactRoundIcon,
  ShieldCheckIcon,
  SquarePen,
} from 'lucide-react';

const admin = '/admin'; // hoặc cấu hình từ env

export interface RouteItem {
  key: string;
  url: string;
  acceptedRoles?: number[];
  name: string;
}

export interface RouteGroup {
  groupName: string;
  icon: string;
  acceptedRoles?: number[];
  routes: RouteItem[];
}

export type GroupedRoutesType = Record<string, RouteGroup>;

const managerRoles = [1, 2, 6];

export const RouteIconMap = {
  HouseIcon: HouseIcon,
  FeedIcon: SquarePen,
  ContactIcon: ContactRoundIcon,
  OrganizationIcon: UsersIcon,
  ContentIcon: FileTextIcon,
  SettingsIcon: CogIcon,
  ModerationIcon: ShieldCheckIcon,
  ReportIcon: ChartBarIcon,
};

export const GroupedRoutes: GroupedRoutesType = {
  realEstate: {
    groupName: 'Quản lý BĐS',
    icon: 'HouseIcon',
    routes: [
      { key: 'listingSell', url: `${admin}/mua-ban`, name: 'Mua bán' },
      { key: 'listingRent', url: `${admin}/cho-thue`, name: 'Cho thuê' },
      { key: 'map', url: `${admin}/ban-do`, name: 'Bản đồ' },

      { key: 'apartment', url: `${admin}/can-ho`, name: 'Căn hộ' },
      {
        key: 'externalListing',
        url: `${admin}/bds-ngoai`,
        name: 'BĐS ngoài',
        acceptedRoles: managerRoles,
      },
      { key: 'planning', url: `${admin}/quy-hoach`, name: 'Quy hoạch' },
      { key: 'sim', url: `${admin}/sim`, name: 'Sim điện thoại' },
    ],
  },
  feed: {
    groupName: 'Tin đăng',
    icon: 'FeedIcon',
    routes: [
      { key: 'post', url: `${admin}/tin-dang`, name: 'Tin đăng nội bộ' },
      {
        key: 'post-external',
        url: `${admin}/tin-dang-ngoai`,
        name: 'Tin đăng ngoài',
        acceptedRoles: managerRoles,
      },
      {
        key: 'price-list',
        url: `${admin}/bieu-phi-tin-dang`,
        name: 'Bảng giá tin đăng',
        acceptedRoles: managerRoles,
      },
    ],
  },
  customer: {
    groupName: 'Khách hàng',
    icon: 'ContactIcon',
    routes: [
      {
        key: 'customer-internal',
        url: `${admin}/khach-hang-noi-bo`,
        name: 'Nội bộ',
      },
      {
        key: 'customer-external',
        url: `${admin}/dang-ky-thanh-vien`,
        name: 'Đăng ký thành viên',
        acceptedRoles: managerRoles,
      },
    ],
  },
  organization: {
    groupName: 'Tổ chức & Nhân sự',
    icon: 'OrganizationIcon',
    acceptedRoles: managerRoles,
    routes: [
      { key: 'branch', url: `${admin}/chi-nhanh`, name: 'Chi nhánh' },
      { key: 'hr', url: `${admin}/nhan-su`, name: 'Nhân sự' },

      {
        key: 'activityLog',
        url: `${admin}/lich-su-hoat-dong`,
        name: 'Lịch sử hoạt động',
      },
    ],
  },
  contentManagement: {
    groupName: 'Quản lý nội dung',
    icon: 'ContentIcon',
    acceptedRoles: managerRoles,
    routes: [
      { key: 'news', url: `${admin}/tin-tuc`, name: 'Tin tức' },
      { key: 'recruitment', url: `${admin}/tuyen-dung`, name: 'Tuyển dụng' },
      { key: 'document', url: `${admin}/van-ban`, name: 'Văn bản' },
      { key: 'notification', url: `${admin}/thong-bao`, name: 'Thông báo' },
    ],
  },
  settings: {
    groupName: 'Cài đặt hệ thống',
    icon: 'SettingsIcon',
    acceptedRoles: managerRoles,
    routes: [
      {
        key: 'realEstateType',
        url: `${admin}/cai-dat/loai-bds`,
        name: 'Loại bất động sản',
      },
      {
        key: 'roles',
        url: `${admin}/cai-dat/chuc-vu`,
        name: 'Chức vụ & Quyền',
      },
      { key: 'address', url: `${admin}/cai-dat/dia-chi`, name: 'Địa chỉ' },
    ],
  },

  moderation: {
    groupName: 'Kiểm duyệt',
    icon: 'ModerationIcon',
    acceptedRoles: managerRoles,
    routes: [
      {
        key: 'reportSpam',
        url: `${admin}/report-spam`,
        name: 'Báo xấu tin đăng',
      },
      {
        key: 'consignment',
        url: `${admin}/consignment`,
        name: 'Ký gửi bất động sản',
      },
    ],
  },
  report: {
    groupName: 'Thống kê & Báo cáo',
    icon: 'ReportIcon',
    acceptedRoles: managerRoles,
    routes: [
      { key: 'dashboard', url: `${admin}`, name: 'Báo cáo tổng quan' },
      {
        key: 'report',
        url: `${admin}/dashboard/report`,
        name: 'Báo cáo doanh thu',
      },
      {
        key: 'userStatus',
        url: `${admin}/user-status`,
        name: 'Tình hình nhân sự',
      },
    ],
  },
};
