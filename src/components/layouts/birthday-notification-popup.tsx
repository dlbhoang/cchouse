"use client";

import { Cake, Sparkles, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import type { INotiUserResponse } from "@/services/api/notifications/INoti";
import { isBirthdayNotification } from "@/services/api/notifications/notification-types";
import userAdminApi from "@/services/api/userAdmin/userAdminApi";

type Props = { userId: number | string };

export default function BirthdayNotificationPopup({ userId }: Props) {
  const [notification, setNotification] = useState<INotiUserResponse>();
  const checkedRef = useRef(false);

  useEffect(() => {
    if (!userId || checkedRef.current) return;
    checkedRef.current = true;

    void userAdminApi
      .getNotifications({ Status: 0, pageIndex: 1, pageSize: 50 })
      .then((response) => {
        const birthday = (response.data ?? [])
          .filter((item) => isBirthdayNotification(item.Notification))
          .sort((a, b) => b.Notification.Id - a.Notification.Id)[0];
        if (birthday) setNotification(birthday);
      })
      .catch(() => {
        // The notification center remains available if this optional popup fails.
      });
  }, [userId]);

  useEffect(() => {
    if (!notification) return;
    const timeout = window.setTimeout(() => setNotification(undefined), 5000);
    return () => window.clearTimeout(timeout);
  }, [notification]);

  if (!notification) return null;

  const item = notification.Notification;
  const isUpcoming = item.ReferenceId?.endsWith(":tomorrow") ?? false;
  const employeeName = (item.Summary ?? "")
    .replace(/^Sinh nhật (hôm nay|ngày mai):\s*/i, "")
    .trim();
  const avatar = item.Thumbnail?.trim();

  return (
    <div
      aria-label="Thông báo sinh nhật"
      className="fixed inset-0 z-[110] flex items-center justify-center bg-[#09122d]/55 p-4 backdrop-blur-[2px]"
      role="status"
    >
      <section className="relative w-full max-w-[760px] overflow-hidden rounded-2xl border border-[#e5c66b]/70 bg-white shadow-[0_28px_90px_rgba(5,12,38,.38)]">
        <button
          type="button"
          aria-label="Đóng thông báo sinh nhật"
          onClick={() => setNotification(undefined)}
          className="absolute right-3 top-3 z-20 rounded-full bg-white/15 p-2 text-white transition hover:bg-white/25"
        >
          <X size={18} aria-hidden="true" />
        </button>

        <div className="relative isolate flex min-h-[300px] items-center gap-7 overflow-hidden bg-[radial-gradient(ellipse_at_82%_12%,rgba(88,117,219,.48),transparent_34%),linear-gradient(116deg,#101a49_0%,#1c2864_58%,#2d235d_100%)] px-8 py-10 text-white max-sm:min-h-0 max-sm:flex-col max-sm:gap-4 max-sm:px-5 max-sm:py-8 max-sm:text-center">
          <div className="pointer-events-none absolute -left-16 -top-24 size-64 rounded-full border border-[#f0ce76]/25" />
          <div className="pointer-events-none absolute -bottom-40 right-8 size-80 rounded-full border border-[#f0ce76]/20" />
          <Sparkles className="absolute left-[12%] top-8 text-[#f5d679]" size={22} aria-hidden="true" />
          <Sparkles className="absolute right-[14%] top-14 text-[#f5d679]" size={17} aria-hidden="true" />
          <Sparkles className="absolute bottom-8 right-[36%] text-[#f5d679]" size={14} aria-hidden="true" />

          <div className="relative z-10 flex size-40 shrink-0 items-center justify-center rounded-full border-[5px] border-[#f3d77f] bg-gradient-to-br from-[#8fa7ff] to-[#32275f] p-1 shadow-[0_0_35px_rgba(245,214,121,.3)] max-sm:size-28">
            {avatar ? (
              <Image
                src={avatar}
                alt={employeeName ? `Ảnh ${employeeName}` : "Ảnh nhân viên"}
                fill
                unoptimized
                className="rounded-full object-cover"
                sizes="160px"
              />
            ) : (
              <Cake size={54} className="text-[#ffe49a]" aria-hidden="true" />
            )}
          </div>

          <div className="relative z-10 min-w-0 flex-1">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#f5d679]">
              C.C.HOUSE · NGÀY ĐẶC BIỆT
            </p>
            <h2 className="text-3xl font-extrabold leading-tight tracking-wide text-[#ffe49a] max-sm:text-2xl">
              {isUpcoming ? "SẮP ĐẾN SINH NHẬT" : "CHÚC MỪNG SINH NHẬT"}
            </h2>
            {employeeName && (
              <p className="mt-3 text-xl font-bold text-white max-sm:text-lg">
                {employeeName}
              </p>
            )}
            <p className="mt-4 max-w-[470px] whitespace-pre-line text-sm leading-6 text-white/90 max-sm:text-left">
              {item.Description}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 px-6 py-4 max-sm:px-4">
          <span className="text-xs font-medium text-slate-500">
            Thông báo sinh nhật · Tự đóng sau 5 giây
          </span>
          <Link
            href={`${AppRoutes.notifications.url}/${item.Id}`}
            onClick={() => setNotification(undefined)}
            className="shrink-0 rounded-lg bg-[#18245d] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#26377f]"
          >
            Xem thông báo
          </Link>
        </div>
      </section>
    </div>
  );
}
