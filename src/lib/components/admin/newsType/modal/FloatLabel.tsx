import { cloneElement, ReactElement, useState } from "react";

import "./FloatLabel.css";

type FloatLabelProps = {
  children: ReactElement<{ value?: string; onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void }>;
  label: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const FloatLabel = ({ children, label, value, onChange }: FloatLabelProps) => {
  const [focus, setFocus] = useState(false);

  const hasValue = value !== undefined && value !== null && String(value).length > 0;
  const isFloating = focus || hasValue;

  return (
    <div
      className={`gfl ${isFloating ? "gfl-active" : ""} ${focus ? "gfl-focus" : ""}`}
      onBlur={() => setFocus(false)}
      onFocus={() => setFocus(true)}
    >
      {cloneElement(children, { value, onChange })}

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