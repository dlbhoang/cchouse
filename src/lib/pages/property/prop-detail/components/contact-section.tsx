"use client";

import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import RenderPhone from "@/lib/components/shared/CustomRender/RenderPhone";
import { IPropResponse } from "@/lib/interfaces/Property/IProp";

type Props = {
  data: IPropResponse;
};

const maskPhone = (phone: string) => {
  if (phone.length <= 4) return phone;
  return `${phone.slice(0, phone.length - 3)}***`;
};

const ContactSection = ({ data }: Props) => {
  const { data: session } = useSession();
  const [revealed, setRevealed] = useState(false);

  const canViewPhone = useMemo(
    () =>
      [1, 2].includes(session?.user.RoleId ?? 0) ||
      session?.user.Id === data.UserAdminId ||
      !data.IsHidePhone,
    [data.IsHidePhone, data.UserAdminId, session?.user.Id, session?.user.RoleId]
  );

  const phones = data.CustomerPhone?.toString().split(",").filter(Boolean) ?? [];
  const showFullPhone = canViewPhone && revealed;

  return (
    <div className="flex flex-col gap-4">
      <div className="pd-contact-row">
        <span className="pd-label">Nhận diện khách hàng</span>
        <span className="pd-value">{data.CustomerTypeName || "--"}</span>
      </div>

      <div className="pd-contact-row">
        <span className="pd-label">Điện thoại</span>
        <div className="pd-phone-row">
          <span className="pd-phone-name">{data.CustomerName || "--"}:</span>
          {phones.length === 0 ? (
            <span className="pd-value">--</span>
          ) : showFullPhone ? (
            <RenderPhone phones={phones} />
          ) : (
            <span className="pd-value">{phones.map(maskPhone).join(", ")}</span>
          )}
          {canViewPhone && phones.length > 0 && (
            <button
              type="button"
              className="pd-eye-btn"
              onClick={() => setRevealed((prev) => !prev)}
              aria-label={revealed ? "Ẩn số điện thoại" : "Hiện số điện thoại"}
            >
              {revealed ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            </button>
          )}
        </div>
        {!canViewPhone && (
          <span className="pd-empty-text text-xs">
            SĐT đang bị ẩn, vui lòng liên hệ quản lý
          </span>
        )}
      </div>
    </div>
  );
};

export default ContactSection;
