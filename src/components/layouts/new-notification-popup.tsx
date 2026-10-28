'use client';

import dayjs from 'dayjs';
import { BellRing } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { AppRoutes } from '@/lib/core/configs/appRoutes';
import type { INotiUserResponse } from '@/services/api/notifications/INoti';
import notiApi from '@/services/api/notifications/notiApi';
import {
  BIRTHDAY_NOTIFICATION_PREFIX,
  isBirthdayNotification,
} from '@/services/api/notifications/notification-types';
import userAdminApi from '@/services/api/userAdmin/userAdminApi';

type Props = { userId: number | string; roleId?: number };

const birthdayRunKey = 'cchouse-birthday-notifications-last-run';

function birthdayDateForYear(value: string | undefined, year: number) {
  if (!value) return undefined;
  const birthDate = dayjs(value);
  if (!birthDate.isValid()) return undefined;

  // In non-leap years, observe a February 29 birthday on February 28.
  if (birthDate.month() === 1 && birthDate.date() === 29 && !isLeapYear(year)) {
    return `${year}-02-28`;
  }
  return `${year}-${birthDate.format('MM-DD')}`;
}

function isLeapYear(year: number) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

export default function NewNotificationPopup({ userId, roleId }: Props) {
  const [notification, setNotification] = useState<INotiUserResponse>();
  const checkedRef = useRef(false);

  useEffect(() => {
    if (!userId || checkedRef.current) return;
    checkedRef.current = true;
    let popupDelay: number | undefined;

    const loadNewNotification = async () => {
      try {
        // The frontend has no server-side scheduler. An admin session runs the
        // daily birthday check when the app is opened, then targets all active staff.
        if ([1, 2].includes(Number(roleId))) {
          const today = dayjs();
          const runKey = `${birthdayRunKey}:${today.format('YYYY-MM-DD')}`;
          if (window.localStorage.getItem(birthdayRunKey) !== runKey) {
            const pageSize = 500;
            const employeesResponse = await userAdminApi.get({
              Status: 1,
              pageIndex: 1,
              pageSize,
            });
            const employees = [...(employeesResponse.data ?? [])];
            const totalPages = Math.ceil(
              (employeesResponse.totalRow ?? employees.length) / pageSize
            );
            const remainingPages = await Promise.all(
              Array.from({ length: Math.max(totalPages - 1, 0) }, (_, index) =>
                userAdminApi.get({
                  Status: 1,
                  pageIndex: index + 2,
                  pageSize,
                })
              )
            );
            for (const page of remainingPages) {
              employees.push(...(page.data ?? []));
            }
            const recipients = employees
              .map((employee) => Number(employee.Id))
              .filter((id) => Number.isFinite(id) && id > 0);
            const tomorrow = today.add(1, 'day');
            const notifications = employees.flatMap((employee) => {
              const id = Number(employee.Id);
              if (!id || !employee.DateOfBirth) return [];

              const isToday =
                birthdayDateForYear(
                  employee.DateOfBirth?.toString(),
                  today.year()
                ) === today.format('YYYY-MM-DD');
              const isTomorrow =
                birthdayDateForYear(
                  employee.DateOfBirth?.toString(),
                  tomorrow.year()
                ) === tomorrow.format('YYYY-MM-DD');
              if (!isToday && !isTomorrow) return [];

              const employeeLabel = [
                employee.Name,
                employee.RoleName,
                employee.BranchName,
              ]
                .filter(Boolean)
                .join(' - ');
              const title = isToday
                ? '🎉 Chúc mừng sinh nhật!!!'
                : '🎂 Ngày mai là sinh nhật nhân viên';
              const description = isToday
                ? `Chúc mừng sinh nhật ${employeeLabel}!\n\nHôm nay là một ngày đặc biệt. Công ty xin gửi đến bạn những lời chúc tốt đẹp nhất. Chúc bạn luôn mạnh khỏe, hạnh phúc, thành công và có thật nhiều niềm vui trong cuộc sống!`
                : `Ngày mai là sinh nhật ${employeeLabel}. Hãy cùng chuẩn bị lời chúc tốt đẹp gửi đến đồng nghiệp nhé!`;

              return [
                {
                  Id: 0,
                  Title: title,
                  Summary: isToday
                    ? `Sinh nhật hôm nay: ${employee.Name}`
                    : `Sinh nhật ngày mai: ${employee.Name}`,
                  Description: description,
                  Thumbnail:
                    typeof employee.Avatar === 'string' ? employee.Avatar : '',
                  ReferenceId: `${BIRTHDAY_NOTIFICATION_PREFIX}${today.format('YYYY-MM-DD')}:${id}:${isToday ? 'today' : 'tomorrow'}`,
                  ReferenceType: 2,
                  SendToUsers: recipients,
                },
              ];
            });

            await Promise.all(
              notifications.map((notification) => notiApi.add(notification))
            );
            window.localStorage.setItem(birthdayRunKey, runKey);
          }
        }

        const response = await userAdminApi.getNotifications({
          Status: 0,
          pageIndex: 1,
          pageSize: 20,
        });
        const unread = response.data ?? [];
        const hasUnreadBirthday = unread.some((item) =>
          isBirthdayNotification(item.Notification)
        );
        const sorted = [...unread]
          .filter((item) => !isBirthdayNotification(item.Notification))
          .sort((a, b) => b.Notification.Id - a.Notification.Id);
        if (sorted[0]) {
          if (hasUnreadBirthday) {
            // Let the dedicated birthday dialog complete before showing a second popup.
            popupDelay = window.setTimeout(
              () => setNotification(sorted[0]),
              5200
            );
          } else {
            setNotification(sorted[0]);
          }
        }
      } catch {
        // The regular notification bell remains available if this request fails.
      }
    };

    void loadNewNotification();
    return () => {
      if (popupDelay !== undefined) window.clearTimeout(popupDelay);
    };
  }, [roleId, userId]);

  useEffect(() => {
    if (!notification) return;
    const timeout = window.setTimeout(() => setNotification(undefined), 5000);
    return () => window.clearTimeout(timeout);
  }, [notification]);

  if (!notification) return null;

  const item = notification.Notification;
  const close = () => setNotification(undefined);

  return (
    <aside
      aria-label="Thông báo mới"
      className="fixed bottom-6 right-6 z-[100] w-[min(420px,calc(100vw-2rem))] overflow-hidden rounded-xl border border-sky-200 bg-white text-neutral-900 shadow-2xl max-sm:bottom-20 max-sm:right-4"
      role="status"
    >
      <div className="flex items-start gap-3 border-l-4 border-[#0588f0] p-4">
        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-sky-50 text-[#0588f0]">
          <BellRing size={19} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <p className="text-sm font-bold text-neutral-900">{item.Title}</p>
            <span className="shrink-0 rounded-full bg-[#0588f0] px-2 py-0.5 text-[10px] font-semibold text-white">
              Mới
            </span>
          </div>
          <p className="line-clamp-3 whitespace-pre-wrap text-sm leading-5 text-neutral-600">
            {item.Description}
          </p>
          <Link
            href={`${AppRoutes.notifications.url}/${item.Id}`}
            onClick={close}
            className="mt-2 inline-flex text-sm font-semibold text-[#0574c9] hover:underline"
          >
            Xem thông báo
          </Link>
        </div>
      </div>
    </aside>
  );
}
