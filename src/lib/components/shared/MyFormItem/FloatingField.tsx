import { type ReactNode } from "react";

type Props = {
  label: string;
  required?: boolean;
  children: ReactNode;
};

export const FloatingField = ({ label, required, children }: Props) => (
  <div className="property-floating-field">
    {children}
    <div className="property-floating-label">
      <span className="property-floating-label-text">{label}</span>
      {required && (
        <span className="property-floating-label-required">*</span>
      )}
    </div>
  </div>
);
