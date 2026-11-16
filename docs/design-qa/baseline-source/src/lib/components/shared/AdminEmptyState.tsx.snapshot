import type { ReactNode } from "react";

export default function AdminEmptyState({
  illustration,
  message,
  className = "",
}: {
  illustration: ReactNode;
  message: string;
  className?: string;
}) {
  return (
    <div className={`admin-empty-state ${className}`} role="status" aria-live="polite">
      <div aria-hidden="true">{illustration}</div>
      <span>{message}</span>
    </div>
  );
}
