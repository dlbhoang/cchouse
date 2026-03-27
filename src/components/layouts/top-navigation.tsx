"use client";

import { FileSearch2, Home, Key, MapPinnedIcon, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import type * as React from "react";
import { useState } from "react";
import {
  filterNavigationByRole,
  filterSubItemsByRole,
  isMenuGroupActive,
  isPathActive,
  type NavigationItem,
  navigationData,
  useCurrentPath,
} from "@/components/layouts/navigation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { ETransType } from "@/lib/core/enum";
import { cn } from "@/lib/utils";
import { AppRoutes } from "../../lib/core/configs/appRoutes";
import { Button } from "../ui/button";
import WardLookupDialog from "./modal/ward-lookup";

// Filter navigation data for top navigation (only show main sections)
const topNavigationData = navigationData.filter((item) =>
  ["Tin đăng", "Khách hàng"].includes(item.title)
);

const propTypeList = [
  {
    value: 1,
    label: "Nhà phố",
  },
  {
    value: 2,
    label: "Biệt thự / Villa",
  },
  {
    value: 4,
    label: "Tòa nhà",
  },
  {
    value: 5,
    label: "Nhà hàng",
  },
  {
    value: 6,
    label: "Khách sạn",
  },
];
const propertyItems: NavigationItem[] = [
  {
    title: "Mua bán",
    url: `${AppRoutes.property.url}?TransType=${ETransType.sell}`,
    icon: Home,
    parentClickable: true,
    renderMode: "vertical",
    items: propTypeList.map((item) => ({
      title: item.label,
      url: `${AppRoutes.property.url}?TransType=${ETransType.sell}&PropTypeIds=${item.value}`,
    })),
  },
  {
    title: "Cho thuê",
    url: `${AppRoutes.property.url}?TransType=${ETransType.rent}`,
    icon: Key,
    parentClickable: true,
    renderMode: "vertical",
    items: propTypeList.map((item) => ({
      title: item.label,
      url: `${AppRoutes.property.url}?TransType=${ETransType.rent}&PropTypeIds=${item.value}`,
    })),
  },
];

const mapItems: NavigationItem[] = [
  {
    title: AppRoutes.map.name,
    url: AppRoutes.map.url,
    icon: MapPinnedIcon,
    parentClickable: true,
    renderMode: "vertical",
    items: [
      {
        title: "Bản đồ vị trí",
        url: AppRoutes.map.url,
        description: "Bản đồ xem vị trí bất động sản",
      },
      {
        title: "Bản đồ quy hoạch",
        url: `/maps/qh/hcm`,
        description: "Bản đồ xem quy hoạch bất động sản",
      },
    ],
  },
];

// Add document as a standalone item
const documentItem: NavigationItem = {
  title: "Văn bản",
  url: AppRoutes.document.url,
  icon: () => <FileSearch2 className="w-4 h-4 mr-1 text-black" />,
  description: AppRoutes.document.name,
};

export function TopNavigation() {
  const router = useRouter();
  const currentPath = useCurrentPath();
  const { data: session } = useSession();
  const [openWardLookup, setOpenWardLookup] = useState(false);
  const userRoleId = session?.user.RoleId || 0;
  const filteredNavigationData = filterNavigationByRole(
    topNavigationData,
    userRoleId
  );

  const menuItems = [...propertyItems, ...filteredNavigationData, ...mapItems];

  return (
    <NavigationMenu viewport={false} className="hidden lg:block">
      <NavigationMenuList>
        {menuItems.map((item) => {
          const isActive = isMenuGroupActive(
            currentPath,
            item.items?.map((subItem) => ({ url: subItem.url })) ?? []
          );

          // Filter sub-items based on user role
          const accessibleSubItems =
            filterSubItemsByRole(item, userRoleId) || [];

          // Only render if there are accessible sub-items
          if (accessibleSubItems.length === 0) {
            return null;
          }

          // If only one sub-item, render as Link instead of dropdown
          if (accessibleSubItems.length === 1) {
            const singleItem = accessibleSubItems[0];
            const itemIsActive = isPathActive(currentPath, singleItem.url);

            return (
              <NavigationMenuItem key={item.title}>
                <NavigationMenuLink asChild active={itemIsActive}>
                  <Link
                    href={singleItem.url}
                    className="flex flex-row items-center font-medium"
                  >
                    {item.icon && <item.icon className="w-4 h-4 mr-2" />}
                    <span className="text-black">{item.title}</span>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            );
          }

          // Multiple sub-items - render as dropdown
          return (
            <NavigationMenuItem key={item.title}>
              {item.parentClickable ? (
                <NavigationMenuTrigger
                  className={isActive ? "bg-accent text-accent-foreground" : ""}
                  // asChild
                >
                  <Link href={item.url} className="flex items-center">
                    {item.icon && <item.icon className="w-4 h-4 mr-2" />}
                    {item.title}
                  </Link>
                </NavigationMenuTrigger>
              ) : (
                <NavigationMenuTrigger
                  className={isActive ? "bg-accent text-accent-foreground" : ""}
                >
                  {item.icon && <item.icon className="w-4 h-4 mr-2" />}
                  {item.title}
                </NavigationMenuTrigger>
              )}
              <NavigationMenuContent>
                <ul
                  className={cn(
                    "grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]",
                    item.renderMode === "vertical" &&
                      "md:grid-cols-1 lg:w-[300px]"
                  )}
                >
                  {accessibleSubItems.map((subItem) => {
                    const itemIsActive = isPathActive(currentPath, subItem.url);
                    return (
                      <ListItem
                        key={subItem.title}
                        title={subItem.title}
                        href={subItem.url}
                        isActive={itemIsActive}
                      >
                        {subItem.description}
                      </ListItem>
                    );
                  })}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          );
        })}

        {/* <NavigationMenuItem
          className={`rounded-md hover:bg-accent ${
            isPathActive(currentPath, documentItem.url) ? 'bg-accent' : ''
          }`}
        >
          <NavigationMenuLink asChild>
            <Link
              href={documentItem.url}
              className="flex flex-row items-center font-medium"
            >
              <FileSearch2 className="w-4 h-4 mr-1 text-black" />
              <span className="text-black">Văn bản</span>
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem> */}

        <NavigationMenuItem className={`rounded-md hover:bg-accent`}>
          <Button
            variant="outline"
            onClick={() => setOpenWardLookup(true)}
            // size={'sm'}
          >
            <Search />
            Tra cứu hành chính
          </Button>
        </NavigationMenuItem>

        <WardLookupDialog
          open={openWardLookup}
          onClose={() => setOpenWardLookup(false)}
        />
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function ListItem({
  title,
  children,
  href,
  isActive = false,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & {
  href: string;
  isActive?: boolean;
}) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild active={isActive}>
        <Link href={href} className={isActive ? "bg-accent/50" : ""}>
          <div
            className={`text-sm leading-none font-semibold ${
              isActive ? "text-primary" : "text-black"
            }`}
          >
            {title}
          </div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
