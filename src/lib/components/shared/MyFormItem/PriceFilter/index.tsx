import { ChevronDown, RotateCcw, Check, X } from "lucide-react";
import { Form, FormInstance } from "antd";
import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ETransType } from "@/lib/core/enum";

const priceData = [
  { id: 1, text: "Dưới 10", priceFrom: 0, priceTo: 10 },
  { id: 2, text: "Từ 10 - 20", priceFrom: 10, priceTo: 20 },
  { id: 3, text: "Từ 20 - 30", priceFrom: 20, priceTo: 30 },
  { id: 4, text: "Từ 30 - 50", priceFrom: 30, priceTo: 50 },
  { id: 5, text: "Từ 50 - 70", priceFrom: 50, priceTo: 70 },
  { id: 6, text: "Từ 70 - 100", priceFrom: 70, priceTo: 100 },
  { id: 7, text: "Từ 100 - 300", priceFrom: 100, priceTo: 300 },
  { id: 8, text: "Từ 300 - 500", priceFrom: 300, priceTo: 500 },
  { id: 9, text: "Trên 500", priceFrom: 500, priceTo: undefined },
];

type Props = {
  form: FormInstance;
};

export const PriceFilter = ({ form }: Props) => {
  const priceFrm = Form.useWatch("PriceFrm", form);
  const priceTo = Form.useWatch("PriceTo", form);
  const transType = Form.useWatch("TransType", form);
  const methodName = Number(transType) === ETransType.sell ? "Tỷ" : "Triệu";

  const [open, setOpen] = useState(false);
  const [fromValue, setFromValue] = useState<string>(priceFrm?.toString() ?? "");
  const [toValue, setToValue] = useState<string>(priceTo?.toString() ?? "");

  useEffect(() => {
    setFromValue(priceFrm?.toString() ?? "");
  }, [priceFrm]);

  useEffect(() => {
    setToValue(priceTo?.toString() ?? "");
  }, [priceTo]);

  const hasValue = Boolean(priceFrm || priceTo);

  const valueLabel = (() => {
    if (priceFrm && priceTo) return `${priceFrm}-${priceTo} ${methodName}`;
    if (priceFrm) return `Trên ${priceFrm} ${methodName}`;
    if (priceTo) return `Dưới ${priceTo} ${methodName}`;
    return methodName;
  })();

  const isPresetActive = (item: (typeof priceData)[number]) =>
    Number(fromValue) === item.priceFrom &&
    (item.priceTo === undefined
      ? toValue === ""
      : Number(toValue) === item.priceTo);

  const handleSelectPreset = (item: (typeof priceData)[number]) => {
    setFromValue(item.priceFrom.toString());
    setToValue(item.priceTo !== undefined ? item.priceTo.toString() : "");
    form.setFieldValue("PriceFrm", item.priceFrom);
    form.setFieldValue("PriceTo", item.priceTo);
    form.submit();
    setOpen(false);
  };

  const handleReset = () => {
    setFromValue("");
    setToValue("");
    form.setFieldValue("PriceFrm", undefined);
    form.setFieldValue("PriceTo", undefined);
  };

  const handleApply = () => {
    form.setFieldValue("PriceFrm", fromValue ? Number(fromValue) : undefined);
    form.setFieldValue("PriceTo", toValue ? Number(toValue) : undefined);
    form.submit();
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn("property-price-trigger", open && "is-open")}
        >
          <span className="property-price-trigger-left">
            <span className="property-price-trigger-label">Khoảng giá</span>
          </span>
          <span className="property-price-trigger-divider" />
          <span className="property-price-trigger-right">
            <span
              className={cn(
                "property-price-trigger-value",
                !hasValue && "is-placeholder"
              )}
            >
              {valueLabel}
            </span>
            <ChevronDown
              className={cn("property-price-trigger-arrow", open && "is-open")}
              size={16}
            />
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent align="start" className="property-price-dropdown">
        <div className="property-price-dropdown-header">
          <span className="property-price-dropdown-title">Khoảng giá</span>
          <button
            type="button"
            className="property-price-dropdown-close"
            onClick={() => setOpen(false)}
            aria-label="Đóng"
          >
            <X size={18} />
          </button>
        </div>

        <div className="property-price-dropdown-divider" />

        <ul className="property-price-dropdown-list">
          {priceData.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => handleSelectPreset(item)}
                className={cn(
                  "property-price-dropdown-item",
                  isPresetActive(item) && "is-active"
                )}
              >
                {item.text} {methodName.toLowerCase()}
              </button>
            </li>
          ))}
        </ul>

        <p className="property-price-dropdown-section-title">
          Khoảng giá ({methodName.toLowerCase()})
        </p>

        <div className="property-price-dropdown-inputs">
          <label className="property-price-dropdown-field">
            <span className="property-price-dropdown-field-label">
              Từ<span className="property-price-dropdown-required">*</span>
            </span>
            <input
              className="property-price-dropdown-input"
              placeholder="Giá từ"
              inputMode="numeric"
              value={fromValue}
              onChange={(e) => setFromValue(e.target.value.replace(/[^\d]/g, ""))}
            />
          </label>

          <span className="property-price-dropdown-arrow-icon">→</span>

          <label className="property-price-dropdown-field">
            <span className="property-price-dropdown-field-label">
              Đến<span className="property-price-dropdown-required">*</span>
            </span>
            <input
              className="property-price-dropdown-input"
              placeholder="Giá đến"
              inputMode="numeric"
              value={toValue}
              onChange={(e) => setToValue(e.target.value.replace(/[^\d]/g, ""))}
            />
          </label>
        </div>

        <div className="property-price-dropdown-footer">
          <button
            type="button"
            className="property-price-dropdown-reset-btn"
            onClick={handleReset}
          >
            <RotateCcw size={16} />
            Đặt lại
          </button>
          <button
            type="button"
            className="property-price-dropdown-apply-btn"
            onClick={handleApply}
          >
            <Check size={16} />
            Áp dụng
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};