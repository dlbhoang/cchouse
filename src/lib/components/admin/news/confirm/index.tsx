import { Modal as LucideModal } from "@/lib/components/antd-lucide";
import {Button} from "antd";
import type { ReactNode } from "react";
import { useState } from "react";
import { NotiBase } from "@/lib/components/shared/NotiBase";

type Props = {
  label: string;
  className?: string;
  title: string;
  description: ReactNode;
  icon: ReactNode;
  danger?: boolean;
  confirmText?: string;
  onConfirm: () => Promise<unknown>;
};

// Figma AlertDialog 2790:143532 and tertiary Button 2420:136848.
const NewsConfirmButton = ({ label, className, title, description, icon, danger, confirmText = "Xác nhận", onConfirm }: Props) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const confirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      setOpen(false);
    } catch (error: unknown) {
      NotiBase("error", error instanceof Error ? error.message : "Không thể thực hiện thao tác");
    } finally {
      setLoading(false);
    }
  };

  return <>
    <Button className={`news-action-btn${className ? ` ${className}` : ""}`} aria-label={label} title={label} icon={icon} onClick={() => setOpen(true)} />
    <LucideModal
      open={open}
      centered
      width={448}
      className="news-confirm-modal"
      closable={false}
      onCancel={() => !loading && setOpen(false)}
      onOk={confirm}
      confirmLoading={loading}
      okText={confirmText}
      cancelText="Hủy"
      okButtonProps={{ danger }}
      cancelButtonProps={{ disabled: loading }}
    >
      <h2 className="news-confirm-title">{title}</h2>
      <div className="news-confirm-description">{description}</div>
    </LucideModal>
  </>;
};

export default NewsConfirmButton;
