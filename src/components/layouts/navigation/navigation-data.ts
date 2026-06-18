import {
  BookUser,
  Building2,
  ChartBar,
  Edit,
  FileSearch2,
  Home,
  ImageIcon,
  Settings2,
  ShieldCheckIcon,
  Users,
} from "lucide-react";
import { appConst } from "@/lib/core/configs/appConst";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import { ETransType } from "@/lib/core/enum";
import type { NavigationItem } from "./navigation-utils";

const MANAGER_ROLES = appConst.MANAGER_ROLES;

export const navigationData: NavigationItem[] = [
  {
    title: "Bất động sản",
    url: "#",
    icon: Home,
    items: [
      {
        title: "Mua bán",
        url: `${AppRoutes.property.url}?TransType=${ETransType.sell}`,
        description: "Danh sách bất động sản mua bán",
      },
      {
        title: "Cho thuê",
        url: `${AppRoutes.property.url}?TransType=${ETransType.rent}`,
        description: "Danh sách bất động sản cho thuê",
      },
      {
        title: "Bản đồ",
        url: AppRoutes.map.url,
        description: "Bản đồ bất động sản",
      },
      {
        title: "Quy hoạch",
        url: "#",
        description: "Bản vẽ quy hoạch bất động sản",
      },
    ],
  },
  {
    title: "Căn hộ",
    url: "#",
    icon: Building2,
    description: "Quản lý căn hộ bán / thuê",
    items: [
      {
        title: "Mua bán",
        url: `${AppRoutes.apartmentUnit.url}?TransType=${ETransType.sell}`,
        description: "Danh sách căn hộ bán",
      },
      {
        title: "Cho thuê",
        url: `${AppRoutes.apartmentUnit.url}?TransType=${ETransType.rent}`,
        description: "Danh sách căn hộ cho thuê",
      },
      {
        title: "Danh sách chung cư",
        url: AppRoutes.apartment.url,
        description: "Danh sách chung cư",
        acceptedRoles: MANAGER_ROLES,
      },
    ],
  },
  {
    title: "Cài đặt ảnh",
    url: "#",
    icon: ImageIcon,
    items: [
      {
        title: "Quản lý Banner",
        url: AppRoutes.banner.url,
        description: "Chỉnh sửa ảnh banner trang chủ",
      },
    ],
  },
  {
    title: "Tin đăng",
    url: "#",
    icon: Edit,
    items: [
      {
        title: "Nội bộ",
        url: AppRoutes.feed.url,
        description: "Tin đăng của nhân viên trong phần mềm quản trị",
      },
      {
        title: "Khách hàng",
        url: AppRoutes.feedWebsite.url,
        description: "Tin đăng của khách hàng trên website",
        acceptedRoles: MANAGER_ROLES,
      },
      {
        title: "Biểu phí",
        url: AppRoutes.feedPricing.url,
        description: "Quản lý các gói phí đăng tin",
        acceptedRoles: MANAGER_ROLES,
      },
    ],
  },
  {
    title: "Kiểm duyệt",
    url: "#",
    icon: ShieldCheckIcon,
    acceptedRoles: MANAGER_ROLES,
    items: [
      {
        title: "Chuyển đổi người nhập SĐT",
        url: AppRoutes.propTransfer.url,
        description: "Chuyển đổi người nhập số điện thoại bất động sản",
      },
      {
        title: "Báo xấu tin đăng",
        url: AppRoutes.reportSpam.url,
        description: "Quản lý báo cáo tin đăng xấu",
      },
      {
        title: "Ký gửi bất động sản",
        url: AppRoutes.consignment.url,
        description: "Quản lý ký gửi bất động sản",
      },
    ],
  },
  {
    title: "Khách hàng",
    url: "#",
    icon: BookUser,
    items: [
      {
        title: "Nội bộ",
        url: AppRoutes.customer.url,
        description: "Quản lý khách hàng nội bộ",
      },
      {
        title: "Đăng ký thành viên",
        url: AppRoutes.userWebsite.url,
        description: "Danh sách khách hàng đã đăng ký thành viên tại C.C.House",
        acceptedRoles: MANAGER_ROLES,
      },
    ],
  },
  {
    title: "Tổ chức & Nhân sự",
    url: "#",
    icon: Users,
    acceptedRoles: MANAGER_ROLES,
    items: [
      {
        title: "Nhân sự",
        url: AppRoutes.userAdmin.url,
        description: "Quản lý nhân sự nội bộ",
      },
      {
        title: "Lịch sử hoạt động",
        url: AppRoutes.activity.url,
        description: "Theo dõi lịch sử hoạt động",
      },
      {
        title: "Sim điện thoại",
        url: AppRoutes.sim.url,
        description: "Quản lý sim điện thoại",
      },
      {
        title: "Chi nhánh",
        url: AppRoutes.branch.url,
        description: "Quản lý chi nhánh",
      },
      {
        title: "Chức vụ & Quyền",
        url: AppRoutes.role.url,
        description: "Quản lý chức vụ và phân quyền",
      },
    ],
  },
  {
    title: "Quản lý nội dung",
    url: "#",
    icon: FileSearch2,
    acceptedRoles: MANAGER_ROLES,
    items: [
      {
        title: "Tin tức",
        url: AppRoutes.news.url,
        description: "Quản lý tin tức và bài viết",
      },
      {
        title: "Tuyển dụng",
        url: AppRoutes.recruitment.url,
        description: "Quản lý thông tin tuyển dụng",
      },
      {
        title: "Văn bản",
        url: AppRoutes.document.url,
        description: "Quản lý văn bản và tài liệu",
      },
      {
        title: "Thông báo",
        url: AppRoutes.notifications.url,
        description: "Quản lý thông báo hệ thống",
      },
    ],
  },
  {
    title: "Cài đặt khác",
    url: "#",
    icon: Settings2,
    acceptedRoles: MANAGER_ROLES,
    items: [
      {
        title: "Loại bất động sản",
        url: AppRoutes.propType.url,
        description: "Cấu hình loại bất động sản",
      },
      {
        title: "Địa chỉ",
        url: AppRoutes.address.url,
        description: "Quản lý địa chỉ và khu vực",
      },
    ],
  },
  {
    title: "Báo cáo thống kê",
    url: "#",
    icon: ChartBar,
    acceptedRoles: MANAGER_ROLES,
    items: [
      {
        title: "Tổng quan",
        url: AppRoutes.dashboard.url,
        description: "Báo cáo tổng quan hệ thống",
      },
      {
        title: "Báo cáo doanh thu",
        url: "#",
        description: "Thống kê doanh thu",
      },
      {
        title: "Tình hình nhân sự",
        url: "#",
        description: "Báo cáo tình hình nhân sự",
      },
    ],
  },
];
