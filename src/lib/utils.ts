import { clsx, type ClassValue } from 'clsx';
import dayjs from 'dayjs';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const APP_MESSAGE = {
  REQUIRED: 'Vui lòng nhập',
  PASSWORD_INVALID: 'Mật khẩu không hợp lệ',
  PHONE_NUMBER_INVALID: 'Số điện thoại không hợp lệ',
};

export const APP_REGEX = {
  PASSWORD:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  PHONE_NUMBER: /^(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b$/,
};

export const maskPhone = (phoneNumber: string) => {
  if (phoneNumber.length <= 6) return phoneNumber;
  const firstSix = phoneNumber.slice(0, 6);
  const masked = '*'.repeat(phoneNumber.length - 6);
  return `${firstSix}${masked}`;
};

export const calculateDuration = (startDate: Date, endDate: Date) => {
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  const diffDays = end.diff(start, 'day');
  return diffDays + 1;
};
