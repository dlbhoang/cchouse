import { ReactNode } from "react";

type DetailFieldProps = {
  label: string;
  value?: ReactNode;
  highlight?: boolean;
  number?: boolean;
};

export const DetailField = ({
  label,
  value,
  highlight,
  number,
}: DetailFieldProps) => (
  <div className="pd-field">
    <div className="pd-field-label">{label}</div>
    <div
      className={[
        number ? "pd-field-number" : "pd-field-value",
        highlight ? "is-highlight" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {value ?? "--"}
    </div>
  </div>
);

type DetailSectionProps = {
  title: string;
  children: ReactNode;
};

export const DetailSection = ({ title, children }: DetailSectionProps) => (
  <div className="pd-section">
    <div className="pd-section-title">{title}</div>
    {children}
  </div>
);

export const DetailGrid = ({ children }: { children: ReactNode }) => (
  <div className="pd-grid">{children}</div>
);
