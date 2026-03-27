"use client";

import {
  BadgeCheck,
  BookMarked,
  Calendar,
  ChevronDown,
  Lock,
  LogOut,
  Search,
} from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { IUserLogged } from "@/types/next-auth";
import { ChangePasswordModal } from "../../lib/components/shared/MyModal/ChangePasswordShadcn";
import { AppRoutes } from "../../lib/core/configs/appRoutes";
import WardLookupDialog from "./modal/ward-lookup";

export function NavUser({ user }: { user: IUserLogged }) {
  const [openModal, setOpenModal] = useState(false);
  const [openWardLookup, setOpenWardLookup] = useState(false);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
            <Avatar className="h-8 w-8 rounded-full">
              <AvatarImage
                src={user.Avatar?.toString()}
                alt={user.Name}
                className="object-cover"
              />
              <AvatarFallback className="rounded-lg">
                {user.Name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left text-sm leading-tight hidden md:grid">
              <span className="truncate font-medium">{user.Name}</span>
              <span className="truncate text-xs text-muted-foreground">
                {user.Code}
              </span>
            </div>
            <ChevronDown className="ml-auto size-4 hidden md:block" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
          side={"bottom"}
          align="end"
          sideOffset={4}
        >
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar className="h-8 w-8 rounded-full">
                <AvatarImage
                  src={user.Avatar?.toString()}
                  alt={user.Name}
                  className="object-cover"
                />
                <AvatarFallback className="rounded-lg">
                  {user.Name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.Name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {user.Code}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Chức vụ: {user.RoleName}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Link
                href={`${AppRoutes.userAdmin.url}/${user.Id}`}
                className="flex items-center gap-2"
              >
                <BadgeCheck />
                Thông tin cá nhân
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setOpenModal(true)}>
              <Lock />
              Đổi mật khẩu
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setOpenWardLookup(true)}>
              <Search />
              Tra cứu hành chính
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                href={AppRoutes.leaveRequest.url}
                className="flex items-center gap-2"
              >
                <Calendar />
                Đặt lịch nghỉ phép
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                href={AppRoutes.document.url}
                className="flex items-center gap-2"
              >
                <BookMarked />
                {AppRoutes.document.name}
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Quy định chung</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Link href={AppRoutes.suDung.url}>{AppRoutes.suDung.name}</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={AppRoutes.hoaHongBan.url}>
                {AppRoutes.hoaHongBan.name}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={AppRoutes.hoaHongThue.url}>
                {AppRoutes.hoaHongThue.name}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={AppRoutes.rule.url}>{AppRoutes.rule.name}</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={AppRoutes.trangPhuc.url}>
                {AppRoutes.trangPhuc.name}
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem>
              <Link href={AppRoutes.marketing.url}>
                {AppRoutes.marketing.name}
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() =>
              signOut({
                callbackUrl: "/login",
              })
            }
          >
            <LogOut />
            Thoát
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ChangePasswordModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
      />
      <WardLookupDialog
        open={openWardLookup}
        onClose={() => setOpenWardLookup(false)}
      />
    </>
  );
}
