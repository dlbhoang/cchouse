import { ReactElement, useState } from "react";

import "./FloatLabel.css";

type FloatLabelProps = {
  children: ReactElement;
  label: string;
  value?: unknown;
};

const FloatLabel = ({ children, label, value }: FloatLabelProps) => {
  const [focus, setFocus] = useState(false);

  const hasValue = value !== undefined && value !== null && String(value).length > 0;
  const isFloating = focus || hasValue;

  return (
    <div
      className={`gfl ${isFloating ? "gfl-active" : ""} ${focus ? "gfl-focus" : ""}`}
      onBlur={() => setFocus(false)}
      onFocus={() => setFocus(true)}
    >
      {children}

      {/* viền + khoảng hở (notch) cho label, tự vẽ bằng fieldset/legend */}
      <fieldset aria-hidden="true" className="gfl-fieldset">
        <legend className="gfl-legend">
          <span>{label}</span>
        </legend>
      </fieldset>

      <label className="gfl-label">{label}</label>
    </div>
  );
};

export default FloatLabel;