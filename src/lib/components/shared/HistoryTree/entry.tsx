import dayjs from "dayjs";
import type { ReactNode } from "react";
import styles from "./history.module.css";

const weekdays = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

export function HistoryEntry({
  timestamp,
  actor,
  action = "Chỉnh sửa",
  children,
  className,
}: {
  timestamp: string;
  actor?: string;
  action?: string;
  children: ReactNode;
  className?: string;
}) {
  const [date, time] = timestamp.split(/\s+(?:-\s+)?/);
  const [day, month, year] = date.split("/");
  const parsed = dayjs(`${year}-${month}-${day}`);
  const weekday = parsed.isSame(dayjs(), "day") ? "Hôm nay" : weekdays[parsed.day()];

  return (
    <li className={className ? `${styles.entry} ${className}` : styles.entry}>
      <div className={styles.date}>{weekday}<span>{date}</span></div>
      <div className={styles.time}>{time}</div>
      <article className={styles.card}>
        <p className={styles.actor}>{action} bởi <strong>{actor || "—"}</strong></p>
        {children}
      </article>
    </li>
  );
}
