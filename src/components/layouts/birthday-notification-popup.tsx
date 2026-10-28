'use client';

import { Cake, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
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
  const normalizedEmployeeName = employeeName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('vi');
  const isFigmaSample =
    !isUpcoming && normalizedEmployeeName === 'le thi mai chi';
  const bannerTitle = isUpcoming ? 'NGÀY MAI LÀ SINH NHẬT' : 'CHÚC MỪNG SINH NHẬT';
  const popupWidth = {
    width: 'min(768px, calc(100vw - 2rem), calc((100dvh - 2rem) * 1.7902))',
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4 max-sm:p-3">
      <dialog
        open
        aria-label="Thông báo sinh nhật"
        aria-modal="true"
        style={popupWidth}
        className="static m-0 block max-w-full overflow-hidden rounded-2xl border-0 bg-[#0d4b85] p-0 shadow-[0_24px_80px_rgba(0,0,0,.42)]"
      >
        <div className="relative aspect-[256/143] w-full overflow-hidden">
          <Image
            src="/images/birthday/figma-birthday-template.png"
            alt=""
            fill
            priority
            unoptimized
            sizes="(max-width: 800px) 100vw, 768px"
            className="object-cover"
          />

          {!isFigmaSample && (
            <>
              <div className="absolute bottom-[8%] left-[40%] right-[2%] top-[8%] flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_48%_0%,#2977ae_0%,#155b97_42%,#123f7c_100%)] px-[2.5%] text-center text-white">
                <p className="text-[clamp(6px,1.15vw,10px)] font-bold uppercase tracking-[0.18em] text-[#ffe08a]">
                  {isUpcoming ? 'C.C.HOUSE • THÔNG BÁO' : 'C.C.HOUSE'}
                </p>
                <h2 className="mt-[1%] text-[clamp(13px,3.5vw,29px)] font-black leading-[1.02] text-[#ffe082] [text-shadow:0_2px_5px_rgba(0,0,0,.6)]">
                  {bannerTitle}
                </h2>
                {employeeName && (
                  <p className="mt-[1.5%] max-w-full truncate text-[clamp(11px,2.75vw,23px)] font-extrabold leading-tight text-white [text-shadow:0_2px_4px_rgba(0,0,0,.65)]">
                    {employeeName}
                  </p>
                )}
                {employeeRole && (
                  <p className="mt-[.5%] max-w-full truncate text-[clamp(6px,1.35vw,11px)] font-bold uppercase leading-tight text-[#fff1ba]">
                    {employeeRole}
                  </p>
                )}
                <p className="mt-[2%] line-clamp-3 max-w-full text-[clamp(6px,1.45vw,12px)] font-semibold leading-[1.25] text-white [text-shadow:0_1px_3px_rgba(0,0,0,.8)]">
                  {wish || (isUpcoming
                    ? 'Ngày mai là sinh nhật đồng nghiệp. Hãy cùng chuẩn bị lời chúc tốt đẹp nhé!'
                    : 'Chúc tuổi mới nhiều niềm vui, hạnh phúc và thành công rực rỡ!')}
                  {!isUpcoming && <span className="mt-[1%] block text-[#ffe69a]">Trân trọng, Ban Lãnh Đạo &amp; Đồng Nghiệp</span>}
                </p>
              </div>

              <div className="absolute left-[7.1%] top-[18%] aspect-square w-[33%] overflow-hidden rounded-full border-[3px] border-[#f3cf5e] bg-[radial-gradient(circle,#f8fbff,#9eb8d5)] shadow-[0_0_13px_rgba(255,207,73,.8)]">
                {avatar ? (
                  <Image
                    src={avatar}
                    alt={employeeName ? `Ảnh ${employeeName}` : 'Ảnh nhân viên'}
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="250px"
                  />
                ) : (
                  <span className="flex size-full items-center justify-center text-[#4477a6]">
                    <Cake className="size-[38%]" aria-hidden="true" />
                  </span>
                )}
              </div>
            </>
          )}

          <button
            type="button"
            aria-label="Đóng thông báo sinh nhật"
            onClick={() => setNotification(undefined)}
            className="absolute right-1 top-1 z-20 rounded-full bg-white/90 p-1.5 text-neutral-700 shadow-md transition hover:bg-white max-sm:p-1"
          >
            <X size={17} aria-hidden="true" />
          </button>
        </div>
      </dialog>
    </div>
  );
}
