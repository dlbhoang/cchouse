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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isMobile, state } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
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
          <Image src="/logo.png" alt="cchouse logo" width={30} height={30} />
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
      <SidebarContent>
        <NavMain items={navigationData} />
      </SidebarContent>
      <SidebarFooter>{/* <NavUser user={data.user} /> */}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
