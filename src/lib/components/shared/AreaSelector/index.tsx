
"use client";

import { Check, ChevronDown, RefreshCw } from "lucide-react";
import { useState } from "react";

export type AreaSelection = {
  province: string;
  district: string;
  ward: string;
  street: string;
  houseNumber: string;
  parcelNumber: string;
  mapSheet: string;
  useNewAddress: boolean;
};

type AreaSelectorProps = {
  onApply?: (selection: AreaSelection) => void;
};

/**
 * Dữ liệu mẫu.
 * Có thể thay bằng dữ liệu lấy từ API sau này.
 */
const provinces = ["Hồ Chí Minh"];

const districts = ["Chọn"];

const wards = ["Chọn"];

const streets = ["Chọn"];

/**
 * Select có label nổi trên viền.
 */
function FloatingSelect({
  label,
  value,
  placeholder = "Chọn",
  options = [],
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  options?: string[];
  onChange?: (value: string) => void;
}) {
  return (
    <div className="relative h-[80px] w-full">
      <label className="absolute -top-3 left-3 z-10 bg-white px-1 text-[16px] leading-6 text-[#0B172A]">
        {label} <span className="text-[#FF3B30]">*</span>
      </label>

      <div className="relative flex h-full items-center rounded-[16px] border border-[#D9DDE3] bg-white px-5">
        <select
          aria-label={label}
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          className={`w-full appearance-none bg-transparent pr-8 text-[18px] font-medium outline-none ${
            value ? "text-[#292929]" : "text-[#A1A9B8]"
          }`}
        >
          <option value="">{placeholder}</option>

          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <ChevronDown
          size={24}
          strokeWidth={1.8}
          className="pointer-events-none absolute right-4 text-[#292929]"
        />
      </div>
    </div>
  );
}

/**
 * Input có label nổi trên viền.
 */
function FloatingInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative h-[80px] w-full">
      <label className="absolute -top-3 left-3 z-10 bg-white px-1 text-[16px] leading-6 text-[#0B172A]">
        {label} <span className="text-[#FF3B30]">*</span>
      </label>

      <div className="flex h-full items-center rounded-[16px] border border-[#D9DDE3] bg-white px-5">
        <input
          aria-label={label}
          type="text"
          value={value}
          placeholder="Nhập"
          onChange={(event) => onChange(event.target.value)}
          className="w-full bg-transparent text-[18px] font-medium text-[#292929] outline-none placeholder:text-[#A1A9B8]"
        />
      </div>
    </div>
  );
}

/**
 * Component chọn khu vực.
 */
export default function AreaSelector({
  onApply,
}: AreaSelectorProps) {
  const [useNewAddress, setUseNewAddress] = useState(false);

  const [selection, setSelection] = useState<AreaSelection>({
    province: "Hồ Chí Minh",
    district: "",
    ward: "",
    street: "",
    houseNumber: "",
    parcelNumber: "",
    mapSheet: "",
    useNewAddress: false,
  });

  /**
   * Cập nhật một hoặc nhiều trường dữ liệu.
   */
  const update = (patch: Partial<AreaSelection>) => {
    setSelection((current) => ({
      ...current,
      ...patch,
    }));
  };

  /**
   * Reset toàn bộ bộ lọc.
   */
  const reset = () => {
    setUseNewAddress(false);

    setSelection({
      province: "Hồ Chí Minh",
      district: "",
      ward: "",
      street: "",
      houseNumber: "",
      parcelNumber: "",
      mapSheet: "",
      useNewAddress: false,
    });
  };

  /**
   * Áp dụng bộ lọc khu vực.
   */
  const apply = () => {
    onApply?.({
      ...selection,
      useNewAddress,
    });
  };

  return (
    <section className="w-[min(100%,680px)] overflow-hidden rounded-[24px] border border-[#EEF0F3] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
      {/* Nội dung chính */}
      <div className="flex flex-col gap-8 bg-white px-8 pb-8 pt-8">
        {/* Toggle địa chỉ mới */}
        <div className="flex min-h-[80px] items-center justify-between gap-4 rounded-[12px] bg-[#F5F5F5] px-5 py-4">
          <span className="text-[20px] font-medium leading-7 text-[#0B172A]">
            Tìm theo địa chỉ mới sau sáp nhập
          </span>

          <button
            type="button"
            role="switch"
            aria-checked={useNewAddress}
            aria-label="Tìm theo địa chỉ mới sau sáp nhập"
            onClick={() => {
              const nextValue = !useNewAddress;

              setUseNewAddress(nextValue);

              update({
                useNewAddress: nextValue,
                district: "",
                ward: "",
                street: "",
              });
            }}
            className={`relative h-8 w-14 shrink-0 rounded-full transition-colors ${
              useNewAddress ? "bg-[#0588F0]" : "bg-[#C4C4C4]"
            }`}
          >
            <span
              className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.2)] transition-transform ${
                useNewAddress
                  ? "translate-x-7"
                  : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Các trường địa chỉ */}
        <div className="flex flex-col gap-8">
          {/* Tỉnh / Thành phố */}
          <FloatingSelect
            label="Tỉnh/Thành phố"
            value={selection.province}
            options={provinces}
            onChange={(province) => update({ province })}
          />

          {/* Quận / Huyện */}
          {!useNewAddress && (
            <FloatingSelect
              label="Quận/Huyện"
              value={selection.district}
              options={districts}
              onChange={(district) => update({ district })}
            />
          )}

          {/* Phường / Xã */}
          <FloatingSelect
            label="Phường/Xã"
            value={selection.ward}
            options={wards}
            onChange={(ward) => update({ ward })}
          />

          {/* Đường / Phố */}
          <FloatingSelect
            label="Đường/Phố"
            value={selection.street}
            options={streets}
            onChange={(street) => update({ street })}
          />

          {/* Số nhà */}
          <FloatingInput
            label="Số nhà"
            value={selection.houseNumber}
            onChange={(houseNumber) =>
              update({ houseNumber })
            }
          />

          {/* Thửa đất và Tờ bản đồ */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <FloatingInput
              label="Thửa đất"
              value={selection.parcelNumber}
              onChange={(parcelNumber) =>
                update({ parcelNumber })
              }
            />

            <FloatingInput
              label="Tờ bản đồ"
              value={selection.mapSheet}
              onChange={(mapSheet) =>
                update({ mapSheet })
              }
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-3 bg-white px-8 pb-8 sm:flex-row">
        {/* Nút đặt lại */}
        <button
          type="button"
          onClick={reset}
          className="flex h-[64px] min-w-0 flex-1 items-center justify-center gap-3 rounded-[16px] border border-[#D9DDE3] bg-white px-5 text-[20px] font-medium text-[#292929] transition-colors hover:bg-[#F8F8F8]"
        >
          <RefreshCw size={22} strokeWidth={2.5} />

          <span>Đặt lại</span>
        </button>

        {/* Nút áp dụng */}
        <button
          type="button"
          onClick={apply}
          className="flex h-[64px] min-w-0 flex-1 items-center justify-center gap-3 rounded-[16px] bg-[#218CF3] px-5 text-[20px] font-medium text-white transition-colors hover:bg-[#0878DD]"
        >
          <Check size={24} strokeWidth={3} />

          <span>Áp dụng</span>
        </button>
      </div>
    </section>
  );
}