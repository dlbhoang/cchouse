"use client";
import vi_VN from "antd/locale/vi_VN";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Session } from "next-auth";
import { type ReactNode, useEffect } from "react";
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

const RootLayout = ({ children, session }: LayoutProps) => {
  const { loading, init, setSmallScreen } = useAdminContext();
  const pathname = usePathname();

  const hideMobileMenu = !RoutesShowMobileMenu.includes(pathname ?? "");

  const isMobile = useIsMobile();
  useEffect(() => {
    setSmallScreen(isMobile);
  }, [isMobile, setSmallScreen]);
  const { getCountOld, visible } = usePropStore();
  useEffect(() => {
    init();
    getCountOld();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AntProvider locale={vi_VN}>
      <SidebarProvider defaultOpen={false}>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 z-30">
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
          <div className="flex flex-1 flex-col gap-4 p-4 bg-gray-50">
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
          {!hideMobileMenu && (
            <div className="fixed bottom-[5%] px-6 md:hidden flex justify-between items-center w-full">
              <MenuTabs />
              <SidebarTrigger
                className="size-8 sm:size-10"
                variant={"outline"}
              />
            </div>
          )}

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
