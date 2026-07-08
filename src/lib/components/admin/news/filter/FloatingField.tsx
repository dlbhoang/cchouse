import React, { type ReactNode } from "react";

export const FloatingField = ({
  label,
  required,
  filled,
  children,
}: {
  label: string;
  required?: boolean;
  filled?: boolean;
  children: ReactNode;
}) => (
  <div
    className={[
      "news-filter-floating-field",
      filled ? "news-filter-floating-field--filled" : "",
    ]
      .filter(Boolean)
      .join(" ")}
  >
    {children}
    <span className="news-filter-floating-label">
      {label}
      {required && <span className="required">*</span>}
    </span>
  </div>
);

export default FloatingField;