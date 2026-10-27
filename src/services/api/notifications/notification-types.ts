import type { INotiResponse } from "./INoti";

export const BIRTHDAY_NOTIFICATION_PREFIX = "birthday:";

export function isBirthdayNotification(notification: INotiResponse) {
  return (
    notification.ReferenceId?.startsWith(BIRTHDAY_NOTIFICATION_PREFIX) === true ||
    notification.ReferenceId?.startsWith("birthday-") === true ||
    // Preserve the test notice created before birthday notifications had a type.
    notification.Title.startsWith("🎉 TEST SINH NHẬT")
  );
}
