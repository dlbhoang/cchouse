import type { MenuProps } from "antd";
import { Dropdown, InputNumber } from "antd";
import { ReactNode, useState } from "react";

import { FormatNumber } from "@/lib/core/utils/myFormat";
import { SelectType } from "@/lib/types/common";

const mockVal = (val: number, up = 1000) => val * up;

type Props = {
  addonAfter?: ReactNode;
};

const PriceAutoComplete = ({
  disabled,
  value,
  onChange,
  addonAfter,
}: SelectType & Props) => {
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const [items, setItems] = useState<MenuProps["items"]>([]);

  const onClick: MenuProps["onClick"] = ({ key }) => {
    if (onChange) onChange(key);
    setOpenDropdown(false);
  };

  const handleInputChange = (val: number | null) => {
    if (!val) {
      setItems([]);
      setOpenDropdown(false);
    } else {
      setItems([
        {
          key: mockVal(val),
          label: FormatNumber(mockVal(val)),
        },
        {
          key: mockVal(val, 10000),
          label: FormatNumber(mockVal(val, 10000)),
        },
        {
          key: mockVal(val, 100000),
          label: FormatNumber(mockVal(val, 100000)),
        },
      ]);
      setOpenDropdown(true);
      if (onChange) onChange(val.toString());
    }
  };

  return (
    <Dropdown
      menu={{ items, onClick }}
      open={openDropdown}
      disabled={disabled}
      onOpenChange={setOpenDropdown}
    >
      <InputNumber
        style={{ width: "100%" }}
        value={Number(value)}
        onChange={handleInputChange}
        formatter={FormatNumber}
        addonAfter={addonAfter}
      />
    </Dropdown>
  );
};

export default PriceAutoComplete;
