'use client';

import { Cake, Sparkles, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { AppRoutes } from '@/lib/core/configs/appRoutes';
import type { INotiUserResponse } from '@/services/api/notifications/INoti';
import { isBirthdayNotification } from '@/services/api/notifications/notification-types';
import userAdminApi from '@/services/api/userAdmin/userAdminApi';

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
  const isUpcoming = item.ReferenceId?.endsWith(':tomorrow') ?? false;
  const summaryName = (item.Summary ?? '')
    .replace(/^Sinh nhật (hôm nay|ngày mai):\s*/i, '')
    .trim();
  const titleName = (item.Title ?? '')
    .replace(
      /^🎉?\s*(?:TEST\s+)?SINH NHẬT(?:\s+(?:HÔM NAY|NGÀY MAI))?[:\s-]*/i,
      ''
    )
    .trim();
  const descriptionName = item.Description?.match(
    /(?:cho|của)\s+([^.!?\n]+)/i
  )?.[1]?.trim();
  const employeeName = summaryName || titleName || descriptionName || '';
  const avatar = item.Thumbnail?.trim();

  return (
    <div
      aria-label="Thông báo sinh nhật"
      className="fixed inset-0 z-[110] flex items-center justify-center bg-[#161b2b]/55 p-4"
      role="status"
    >
      <section className="relative w-full max-w-[560px] overflow-hidden rounded-lg bg-white shadow-[0_18px_60px_rgba(0,0,0,.28)]">
        <header className="flex min-h-12 items-center justify-between border-b border-slate-100 px-5 py-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-[#202124]">
            <Cake className="size-4 text-[#0788f5]" aria-hidden="true" />
            Thông báo sinh nhật
          </h2>
          <button
            type="button"
            aria-label="Đóng thông báo sinh nhật"
            onClick={() => setNotification(undefined)}
            className="rounded p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </header>

        <div className="p-5 max-sm:p-4">
          <div className="relative isolate flex min-h-[142px] items-center gap-4 overflow-hidden rounded-md bg-[radial-gradient(circle_at_85%_15%,rgba(255,220,113,.42),transparent_24%),linear-gradient(115deg,#173a86_0%,#176fc2_58%,#3a7ac2_100%)] px-5 py-4 text-white max-sm:min-h-[128px] max-sm:gap-3 max-sm:px-3">
            <div className="pointer-events-none absolute -right-5 -top-10 size-36 rounded-full border border-white/20" />
            <div className="pointer-events-none absolute -bottom-16 right-24 size-36 rounded-full border border-[#ffe08a]/35" />
            <Sparkles
              className="absolute right-5 top-4 size-4 text-[#ffe08a]"
              aria-hidden="true"
            />
            <div className="relative flex size-[88px] shrink-0 items-center justify-center overflow-hidden rounded-full border-[3px] border-[#f7d879] bg-[#254e9a] shadow-lg max-sm:size-[72px]">
              {avatar ? (
                <Image
                  src={avatar}
                  alt={employeeName ? `Ảnh ${employeeName}` : 'Ảnh nhân viên'}
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="88px"
                />
              ) : (
                <Cake size={34} className="text-[#ffe49a]" aria-hidden="true" />
              )}
            </div>
            <div className="relative min-w-0 flex-1 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#ffe49a]">
                C.C.HOUSE
              </p>
              <h3 className="mt-1 text-xl font-extrabold leading-tight text-white max-sm:text-base">
                {isUpcoming ? 'SẮP ĐẾN SINH NHẬT' : 'CHÚC MỪNG SINH NHẬT'}
              </h3>
              {employeeName && (
                <p className="mt-1 line-clamp-2 text-sm font-semibold text-white max-sm:text-xs">
                  {employeeName}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 text-[13px] leading-6 text-[#262626]">
            <p className="font-semibold">
              <span aria-hidden="true">🎉 </span>
              {isUpcoming ? 'Ngày mai là sinh nhật' : 'Chúc mừng sinh nhật'}
              {employeeName ? ` ${employeeName}` : ' nhân viên'}!
            </p>
            {item.Description && (
              <p className="mt-2 whitespace-pre-line text-slate-600">
                {item.Description}
              </p>
            )}
          </div>

          <Link
            href={`${AppRoutes.notifications.url}/${item.Id}`}
            onClick={() => setNotification(undefined)}
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#0788f5] hover:underline"
          >
            Xem trong danh sách thông báo
          </Link>
        </div>
      </section>
    </div>
  );
}
