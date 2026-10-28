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
    .replace(/^🎉?\s*Chúc mừng sinh nhật\s*/i, '')
    .trim();
  const titleName = (item.Title ?? '')
    .replace(
      /^🎉?\s*(?:TEST\s+)?SINH NHẬT(?:\s+(?:HÔM NAY|NGÀY MAI))?[:\s-]*/i,
      ''
    )
    .trim();
  const descriptionLabel = item.Description?.match(
    /(?:Chúc mừng sinh nhật|Ngày mai là sinh nhật)\s+([^\n.!?]+)/i
  )?.[1]?.trim();
  const descriptionParts = descriptionLabel
    ?.split(/\s+-\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
  const employeeName = summaryName || titleName || descriptionParts?.[0] || '';
  const employeeRole = descriptionParts?.slice(1).join(' · ') ?? '';
  const wish = item.Description?.split(/\n\s*\n/).slice(1).join('\n\n').trim();
  const avatar = item.Thumbnail?.trim();

  return (
    <div
      aria-label="Thông báo sinh nhật"
      className="fixed inset-0 z-[110] flex items-center justify-center bg-[#161b2b]/60 p-4"
      role="status"
    >
      <section className="relative w-full max-w-[768px] overflow-hidden rounded-2xl border border-[#f6d46b] bg-[#082b66] shadow-[0_24px_80px_rgba(0,0,0,.42)]">
        <button
          type="button"
          aria-label="Đóng thông báo sinh nhật"
          onClick={() => setNotification(undefined)}
          className="absolute right-3 top-3 z-20 rounded-full bg-[#071b40]/55 p-2 text-white transition hover:bg-[#071b40]/80"
        >
          <X size={18} aria-hidden="true" />
        </button>

        <div className="relative isolate grid min-h-[429px] grid-cols-[0.88fr_1.4fr] items-center gap-7 overflow-hidden bg-[radial-gradient(circle_at_50%_45%,rgba(255,222,114,.2),transparent_27%),radial-gradient(circle_at_85%_16%,rgba(255,255,255,.2),transparent_18%),linear-gradient(125deg,#0758a9_0%,#0b3d82_56%,#052c67_100%)] px-12 py-10 text-center text-white max-md:min-h-0 max-md:grid-cols-[minmax(88px,0.8fr)_1.6fr] max-md:gap-4 max-md:px-5 max-md:py-8 max-sm:gap-3 max-sm:px-4 max-sm:py-12">
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <div className="absolute -left-8 -top-12 size-28 rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff9d8,#f6d978_38%,#d59d2d_78%)] opacity-90 shadow-[inset_-10px_-12px_20px_rgba(137,82,0,.22)] max-sm:size-16" />
            <div className="absolute left-[18%] -top-10 size-20 rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff,#dbeeff_45%,#6a9bc4)] opacity-90 max-sm:size-12" />
            <div className="absolute -right-7 top-10 size-24 rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff9d8,#f3d36a_42%,#d99423)] opacity-90 max-sm:size-14" />
            <div className="absolute -bottom-12 left-1/3 size-24 rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff,#dbeeff_45%,#6a9bc4)] opacity-90 max-sm:size-14" />
            <div className="absolute -bottom-10 right-[17%] size-20 rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff9d8,#f3d36a_42%,#d99423)] opacity-90 max-sm:size-12" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_70%,rgba(255,211,94,.42)_0_2px,transparent_3px),radial-gradient(circle_at_72%_18%,rgba(255,255,255,.55)_0_2px,transparent_3px),radial-gradient(circle_at_84%_66%,rgba(255,220,112,.6)_0_2px,transparent_3px)] bg-[length:83px_71px]" />
          </div>
          <Sparkles className="absolute right-10 top-8 size-6 text-[#ffe08a] max-sm:right-4 max-sm:top-4 max-sm:size-4" aria-hidden="true" />
          <div className="relative mx-auto flex aspect-square w-full max-w-[220px] items-center justify-center rounded-full border-[5px] border-[#f4cf58] bg-[radial-gradient(circle,#f8fbff_0%,#d4e6f5_70%,#97b5d3_100%)] p-2 shadow-[0_0_0_9px_rgba(255,211,91,.2),0_0_38px_rgba(255,207,73,.7)] max-md:max-w-[160px] max-sm:max-w-[92px] max-sm:border-[3px] max-sm:p-1">
            <div className="relative size-full overflow-hidden rounded-full">
              {avatar ? (
                <Image
                  src={avatar}
                  alt={employeeName ? `Ảnh ${employeeName}` : 'Ảnh nhân viên'}
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="220px"
                />
              ) : (
                <div className="flex size-full items-center justify-center bg-[linear-gradient(135deg,#dbeafe,#f8fafc)] text-[#2774a7]">
                  <Cake size={64} className="max-sm:size-9" aria-hidden="true" />
                </div>
              )}
            </div>
          </div>
          <div className="relative z-10 min-w-0 py-3 text-left max-sm:py-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-[#ffe394] max-sm:text-[8px] max-sm:tracking-[0.2em]">C.C.HOUSE</p>
            <h2 className="mt-2 text-4xl font-black leading-[1.03] text-[#ffe594] [text-shadow:0_2px_0_#9b6b1b,0_5px_16px_rgba(0,0,0,.45)] max-md:text-3xl max-sm:mt-1 max-sm:text-lg">
              {isUpcoming ? 'NGÀY MAI LÀ SINH NHẬT' : 'CHÚC MỪNG SINH NHẬT'}
            </h2>
            {employeeName && <p className="mt-3 text-2xl font-extrabold text-white max-md:text-xl max-sm:mt-1 max-sm:text-sm">{employeeName}</p>}
            {employeeRole && <p className="mt-1 text-xs font-bold uppercase tracking-wide text-[#f5d778] max-sm:text-[8px]">{employeeRole}</p>}
            <p className="mt-4 max-w-[410px] text-sm leading-6 text-white/95 max-md:mt-3 max-md:text-xs max-sm:mt-2 max-sm:text-[9px] max-sm:leading-4">
              {wish || (isUpcoming
                ? 'Hãy cùng chuẩn bị lời chúc tốt đẹp gửi đến đồng nghiệp nhé!'
                : 'Chúc bạn tuổi mới thật nhiều niềm vui, hạnh phúc và thành công rực rỡ trong sự nghiệp cùng công ty!')}
            </p>
            <p className="mt-3 text-xs font-semibold text-[#ffe394] max-sm:mt-1 max-sm:text-[8px]">Trân trọng, Ban Lãnh Đạo &amp; Đồng Nghiệp</p>
          </div>
          <Link
            href={`${AppRoutes.notifications.url}/${item.Id}`}
            onClick={() => setNotification(undefined)}
            className="absolute bottom-3 right-5 z-10 text-xs font-semibold text-white/80 underline decoration-white/50 underline-offset-2 hover:text-white max-sm:bottom-2 max-sm:right-3 max-sm:text-[9px]"
          >
            Xem thông báo
          </Link>
        </div>
      </section>
    </div>
  );
}
