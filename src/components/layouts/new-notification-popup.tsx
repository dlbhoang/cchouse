"use client";

import { BellRing, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import type { INotiUserResponse } from "@/services/api/notifications/INoti";
import userAdminApi from "@/services/api/userAdmin/userAdminApi";

type Props = { userId: number | string };

const cursorKey = (userId: number | string) =>
  `cchouse-notification-popup-cursor:${userId}`;

export default function NewNotificationPopup({ userId }: Props) {
  const [notification, setNotification] = useState<INotiUserResponse>();
  const checkedRef = useRef(false);

  useEffect(() => {
    if (!userId || checkedRef.current) return;
    checkedRef.current = true;

    const loadNewNotification = async () => {
      try {
        const key = cursorKey(userId);
        const savedCursor = window.localStorage.getItem(key);
        const cursor = savedCursor ? Number(savedCursor) : undefined;
        const response = await userAdminApi.getNotifications({
          Status: 0,
          pageIndex: 1,
          pageSize: 20,
        });
        const unread = response.data ?? [];
        const sorted = [...unread].sort(
          (a, b) => b.Notification.Id - a.Notification.Id,
        );
        const latestId = sorted[0]?.Notification.Id;
        if (latestId === undefined) return;

        // On first use, surface the latest unread item. Later entries only
        // surface notifications created after this user's saved ID cursor.
        const newest = cursor === undefined
          ? sorted[0]
          : sorted.find((item) => item.Notification.Id > cursor);

        window.localStorage.setItem(key, String(Math.max(cursor ?? 0, latestId)));
        if (newest) setNotification(newest);
      } catch {
        // The regular notification bell remains available if this request fails.
      }
    };

    void loadNewNotification();
  }, [userId]);

  if (!notification) return null;

  const item = notification.Notification;
  const close = () => setNotification(undefined);

  return (
    <aside
      aria-label="Thông báo mới"
      className="fixed bottom-6 right-6 z-[100] w-[min(420px,calc(100vw-2rem))] overflow-hidden rounded-xl border border-[#6b542d] bg-[#49391f] text-white shadow-2xl max-sm:bottom-20 max-sm:right-4"
      role="status"
    >
      <div className="flex items-start gap-3 border-l-4 border-amber-400 p-4">
        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-400/15 text-amber-400">
          <BellRing size={19} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2 pr-5">
            <p className="text-sm font-bold text-[#f3d98f]">{item.Title}</p>
            <span className="shrink-0 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-semibold text-white">
              Mới
            </span>
          </div>
          <p className="line-clamp-3 whitespace-pre-wrap text-sm leading-5 text-neutral-100">
            {item.Description}
          </p>
          <Link
            href={`${AppRoutes.notifications.url}/${item.Id}`}
            onClick={close}
            className="mt-2 inline-flex text-sm font-semibold text-red-300 underline underline-offset-2 hover:text-red-200"
          >
            Xem thông báo
          </Link>
        </div>
        <button
          type="button"
          aria-label="Đóng thông báo mới"
          onClick={close}
          className="absolute right-2 top-2 rounded-md p-1 text-white/70 hover:bg-white/10 hover:text-white"
        >
          <X size={16} aria-hidden="true" />
        </button>
      </div>
    </aside>
  );
}
