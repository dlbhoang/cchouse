import { cloneElement, isValidElement, ReactElement, useState } from "react";

type FloatLabelProps = {
  children: ReactElement<Record<string, any>>;
  label: string;
  value?: string;
  [key: string]: any;
};

const FloatLabel = ({ children, label, value, ...rest }: FloatLabelProps) => {
  const [focus, setFocus] = useState(false);

  const isOccupied = focus || (value !== undefined && value !== null && `${value}`.length > 0);
  const labelClass = isOccupied ? "float-label-text float-label-text-active" : "float-label-text";

  return (
    <div
      className="float-label-wrapper"
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
    >
      {isValidElement(children) ? cloneElement(children, { value, ...rest }) : children}
      <label className={labelClass}>{label}</label>
    </div>
  );
};

export default FloatLabel;