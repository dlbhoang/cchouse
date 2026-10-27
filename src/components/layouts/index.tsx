"use client";
import vi_VN from "antd/locale/vi_VN";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Session } from "next-auth";
import { type CSSProperties, type ReactNode, useEffect } from "react";
import { useState } from "react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import BottomFixed from "@/lib/components/shared/BottomFixed";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import { ETransType } from "@/lib/core/enum";
import PropCompare from "@/lib/core/layout/components/PropCompare";
import { useIsMobile } from "@/lib/hooks/use-mobile";
import { useAdminContext, usePropStore } from "../../lib/stored";
import { ApartmentUnitCarts } from "./apartment-unit-carts";
import { AppSidebar } from "./app-sidebar";
import { CustomerWishlist } from "./customer-wishlist";
import MenuTabs from "./menu-tabs";
import { NavUser } from "./nav-user";
import { PropCarts } from "./prop-carts";
import { TopNavigation } from "./top-navigation";
import TopNotification from "./top-notification";
import NewNotificationPopup from "./new-notification-popup";
import ServerConfigModal from "@/lib/pages/config/server";
import { Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChangePasswordModal } from "@/lib/components/shared/MyModal/ChangePasswordShadcn";

const AntProvider = dynamic(() => import("@/lib/components/AntProvider"), {
  ssr: false,
});

type LayoutProps = {
  hideMobileMenu?: boolean;
  children: ReactNode;
  session: Session;
};

//map all url from AppRoutes to array
const RoutesShowMobileMenu = Object.values(AppRoutes).map((route) => route.url);

const getPageLayout = (pathname: string | null) => {
  if (pathname === AppRoutes.map.url) {
    return {
      isNewsPage: false,
      sidebarStyle: { "--sidebar-width-icon": "68px" } as CSSProperties,
      headerClass: "map-admin-header h-16 border-b border-gray-100 bg-white",
      contentClass: "min-w-0 gap-2 bg-white",
    };
  }

  if (pathname === AppRoutes.news.url) {
    return {
      isNewsPage: true,
      sidebarStyle: { "--sidebar-width-icon": "68px" } as CSSProperties,
      headerClass: "news-admin-header h-[78px] border-b border-gray-100 bg-white",
      contentClass: "min-w-0 gap-4 bg-white px-4 pb-4 pt-4 max-md:px-3 max-md:pt-4 max-md:pb-24",
    };
  }

  return {
    isNewsPage: false,
    sidebarStyle: undefined,
    headerClass: "h-16",
    contentClass: "gap-4 bg-gray-50",
  };
};

const RootLayout = ({ children, session }: LayoutProps) => {
  const sessionUser = session?.user as any;
  const [serverConfigOpen, setServerConfigOpen] = useState(false);
  const [mustChangePassword, setMustChangePassword] = useState(
    Boolean(
      sessionUser?.MustChangePassword ?? sessionUser?.mustChangePassword
    )
  );
  const { loading, init, setSmallScreen } = useAdminContext();
  const pathname = usePathname();
  const pageLayout = getPageLayout(pathname);

  const hideMobileMenu = !RoutesShowMobileMenu.includes(pathname ?? "");

  const isMobile = useIsMobile();
  useEffect(() => {
    setSmallScreen(isMobile);
  }, [isMobile, setSmallScreen]);

  useEffect(() => {
    setMustChangePassword(
      Boolean(
        sessionUser?.MustChangePassword ?? sessionUser?.mustChangePassword
      )
    );
  }, [sessionUser?.MustChangePassword, sessionUser?.mustChangePassword]);
  const { getCountOld, visible } = usePropStore();
  useEffect(() => {
    init();
    getCountOld();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AntProvider locale={vi_VN}>
      <SidebarProvider
        defaultOpen={false}
        style={pageLayout.sidebarStyle}
      >
        <AppSidebar isNewsPage={pageLayout.isNewsPage} />
        <SidebarInset
          className={
            pageLayout.isNewsPage || pathname === AppRoutes.map.url
              ? "min-w-0"
              : undefined
          }
        >
          <header
            className={`flex shrink-0 items-center gap-2 z-30 ${pageLayout.headerClass}`}
          >
            <div className="flex justify-between w-full items-center px-4">
              <div className="flex gap-2 items-center">
                <SidebarTrigger className="hidden md:flex -ml-1" />
                <Link
                  href={`${AppRoutes.property.url}?TransType=${ETransType.sell}`}
                  className="flex md:hidden"
                >
                  <Image
                    src="/logo/logo-w-slogan.jpg"
                    alt="cchouse-logo"
                    className="object-cover"
                    width={140}
                    height={30}
                  />
                </Link>
                <TopNavigation />
              </div>
              {/* <SearchCommand isIconOnly={smallScreen} /> */}

              {session?.user && (
                <div className="flex items-center gap-2">
                  {[1, 2].includes(Number(session.user.RoleId)) && (
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Cài đặt địa chỉ máy chủ"
                      onClick={() => setServerConfigOpen(true)}
                    >
                      <Server size={18} />
                    </Button>
                  )}
                  <TopNotification />
                  {session.user?.Id && <PropCarts userId={session.user?.Id} />}
                  <div className="hidden md:flex gap-2">
                    <ApartmentUnitCarts />
                    <CustomerWishlist />
                  </div>
                  <NavUser user={session.user} />
                </div>
              )}
            </div>
          </header>
          {session?.user?.Id && !mustChangePassword && (
            <NewNotificationPopup userId={session.user.Id} />
          )}
          <div
            className={`flex flex-1 flex-col p-4 ${pageLayout.contentClass}`}
          >
            {loading ? (
              <>
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                  <div className="bg-muted/70 aspect-video rounded-xl" />
                  <div className="bg-muted/70 aspect-video rounded-xl" />
                  <div className="bg-muted/70 aspect-video rounded-xl" />
                </div>
                <div className="bg-muted/70 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
              </>
            ) : (
              children
            )}
          </div>
          {[1, 2].includes(Number(session.user.RoleId)) && (
            <ServerConfigModal
              open={serverConfigOpen}
              onClose={() => setServerConfigOpen(false)}
            />
          )}
          {!hideMobileMenu && (
            <div className={`fixed bottom-[5%] px-6 md:hidden flex justify-between items-center w-full ${pathname === AppRoutes.map.url ? "z-50" : ""}`}>
              <MenuTabs />
              <SidebarTrigger
                className="size-8 sm:size-10"
                variant={"outline"}
              />
            </div>
          )}

          <ChangePasswordModal
            isOpen={mustChangePassword}
            required
            onClose={() => {
              setMustChangePassword(false);
              window.location.reload();
            }}
          />

          {visible && (
            <BottomFixed>
              <PropCompare />
            </BottomFixed>
          )}
        </SidebarInset>
      </SidebarProvider>
    </AntProvider>
  );
};

export default RootLayout;
