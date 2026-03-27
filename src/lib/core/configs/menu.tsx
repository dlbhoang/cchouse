import {
  BadgeCheck,
  BellRingIcon,
  BookUserIcon,
  BriefcaseBusinessIcon,
  Building2Icon,
  ChartNoAxesCombinedIcon,
  FileTypeIcon,
  HistoryIcon,
  HouseIcon,
  HousePlugIcon,
  HousePlus,
  ListCheckIcon,
  MapIcon,
  MapPinnedIcon,
  MonitorCheckIcon,
  NewspaperIcon,
  Replace,
  SettingsIcon,
  SmartphoneIcon,
  SquareActivityIcon,
  SquarePenIcon,
  TriangleAlert,
  UsersIcon,
} from "lucide-react";
import { ReactNode } from "react";
import { ETransType } from "../enum";
import { AppRoutes } from "./appRoutes";

export interface MyMenuItem {
  url: string;
  name: string;
  icon?: ReactNode;
  subItems?: MyMenuItem[];
  type?: "group";
  acceptedRoles?: number[];
  disabled?: boolean;
}

const adminRoute = "/admin";

const apartmentMenu: MyMenuItem = {
  ...AppRoutes.apartment,
  name: "Căn hộ",
  icon: <HousePlugIcon />,
  subItems: [
    {
      url: `/unit?TransType=${ETransType.sell}`,
      name: "Mua bán",
    },
    {
      url: `/unit?TransType=${ETransType.rent}`,
      name: "Cho thuê",
    },
    {
      ...AppRoutes.apartment,
      url: "",
      acceptedRoles: [1, 2],
    },
  ],
};

const feedMenu: MyMenuItem = {
  ...AppRoutes.feed,
  name: "Tin đăng",
  icon: <SquarePenIcon />,
  subItems: [
    {
      url: "",
      name: `${AppRoutes.feed.name}`,
    },
    {
      url: "/website",
      name: `${AppRoutes.feedWebsite.name}`,
      acceptedRoles: [1, 2],
    },
    {
      ...AppRoutes.feedPricing,
      url: "/pricing",
      acceptedRoles: [1, 2],
    },
  ],
};

const customerMenu: MyMenuItem = {
  ...AppRoutes.customer,
  icon: <BookUserIcon />,
  subItems: [
    {
      url: "",
      name: `Nội bộ`,
    },
    {
      url: "/website",
      name: `${AppRoutes.userWebsite.name}`,
      acceptedRoles: [1, 2],
    },
  ],
};

export const MENU_CONFIG: MyMenuItem[] = [
  {
    url: adminRoute,
    name: "QUẢN LÝ NỘI BỘ",
    type: "group",
    subItems: [
      { ...customerMenu },
      {
        url: "https://cchouse.vn/maps/qh/hcm/",
        name: "Quy hoạch",
        icon: <MapIcon />,
      },
      {
        ...AppRoutes.sim,
        url: AppRoutes.sim.url.replace("/admin", ""),
        icon: <SmartphoneIcon />,
        // acceptedRoles: [1, 2],
      },
      {
        ...AppRoutes.userAdmin,
        url: AppRoutes.userAdmin.url.replace("/admin", ""),
        icon: <UsersIcon />,
        acceptedRoles: [1, 2, 6],
      },
      {
        ...AppRoutes.activity,
        icon: <HistoryIcon />,
        url: AppRoutes.activity.url.replace("/admin", ""),
        acceptedRoles: [1, 2, 6],
      },
      { ...feedMenu },
      {
        ...AppRoutes.document,
        url: AppRoutes.document.url.replace("/admin", ""),
        icon: <FileTypeIcon />,
      },
      { ...apartmentMenu },
      {
        ...AppRoutes.propTemp,
        icon: <ListCheckIcon />,
        acceptedRoles: [1, 2, 6],
      },
    ],
  },
  {
    url: adminRoute,
    name: "CẤU HÌNH",
    type: "group",
    acceptedRoles: [1, 2],
    subItems: [
      { ...AppRoutes.recruitment, icon: <BriefcaseBusinessIcon /> },
      { ...AppRoutes.news, icon: <NewspaperIcon /> },
      { ...AppRoutes.branch, icon: <Building2Icon /> },
      { ...AppRoutes.notifications, icon: <BellRingIcon /> },
      {
        url: AppRoutes.config.url,
        name: "Cài đặt chung",
        icon: <SettingsIcon />,
        subItems: [
          // {
          //   ...AppRoutes.propAddress,
          //   url: AppRoutes.propAddress.url.replace(AppRoutes.config.url, ''),
          // },
          {
            ...AppRoutes.propType,
            url: AppRoutes.propType.url.replace(AppRoutes.config.url, ""),
          },
          {
            ...AppRoutes.role,
            url: AppRoutes.role.url.replace(AppRoutes.config.url, ""),
          },
          {
            ...AppRoutes.address,
            url: AppRoutes.address.url.replace(AppRoutes.config.url, ""),
          },
        ],
      },
    ],
  },
  {
    url: adminRoute,
    name: "Kiểm duyệt",
    type: "group",
    acceptedRoles: [1, 2],
    subItems: [
      { ...AppRoutes.propTransfer, icon: <Replace size={16} /> },
      { ...AppRoutes.verifyProperty, icon: <BadgeCheck size={16} /> },
      { ...AppRoutes.reportSpam, icon: <TriangleAlert size={16} /> },
      {
        ...AppRoutes.consignment,
        icon: <HousePlus size={16} />,
      },
    ],
  },
  {
    url: adminRoute,
    name: "THÔNG KÊ",
    type: "group",
    acceptedRoles: [1],
    subItems: [
      {
        ...AppRoutes.dashboard,
        icon: <MonitorCheckIcon />,
      },
      {
        ...AppRoutes.report,
        icon: <ChartNoAxesCombinedIcon />,
        disabled: true,
      },

      {
        ...AppRoutes.userStatus,
        icon: <SquareActivityIcon />,
        disabled: true,
      },
    ],
  },
];

export const MENU_HEADER: MyMenuItem[] = [
  {
    name: "Mua bán",
    icon: <HouseIcon />,
    url: `${AppRoutes.property.url}?TransType=${ETransType.sell}`,
  },
  {
    name: "Cho thuê",
    icon: <HouseIcon />,
    url: `${AppRoutes.property.url}?TransType=${ETransType.rent}`,
  },
  { ...feedMenu },
  {
    name: "Bản đồ",
    icon: <MapPinnedIcon />,
    url: `${AppRoutes.map.url}`,
    disabled: false,
  },
  {
    ...AppRoutes.document,
    icon: <FileTypeIcon />,
  },
  { ...customerMenu },
  { ...apartmentMenu },
];
