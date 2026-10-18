"use client";

import Image from "next/image";
import type * as React from "react";
import { navigationData } from "@/components/layouts/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";

export function AppSidebar({
  isNewsPage = false,
  ...props
}: React.ComponentProps<typeof Sidebar> & { isNewsPage?: boolean }) {
  const { isMobile, state } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props} className={[isNewsPage ? "news-sidebar" : "", props.className].filter(Boolean).join(" ")}>
      <SidebarHeader className={isNewsPage ? "items-center px-3 py-4" : undefined}>
        {/* Option 1: Using state property (recommended) */}
        {isMobile ? (
          <Image
            src="/logo/logo-w-slogan.jpg"
            alt="cchouse-logo"
            className="object-cover"
            width={160}
            height={40}
          />
        ) : state === "collapsed" ? (
          <Image
            src="/logo.png"
            alt="cchouse logo"
            width={isNewsPage ? 44 : 30}
            height={isNewsPage ? 44 : 30}
          />
        ) : (
          <Image
            src="/logo/logo-w-slogan.jpg"
            alt="cchouse-logo"
            className="object-cover"
            width={160}
            height={40}
          />
        )}
      </SidebarHeader>
      <SidebarContent className={isNewsPage ? "pt-2" : undefined}>
        <NavMain items={navigationData} />
      </SidebarContent>
      <SidebarFooter>{/* <NavUser user={data.user} /> */}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
