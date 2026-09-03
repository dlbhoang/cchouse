import { XIcon } from "lucide-react";
import { useState } from "react";
import { Button, Input, Modal } from "antd";

import { NotiBase } from "@/lib/components/shared/NotiBase";
import newsApi from "@/services/api/news/newsApi";

type Props = {
  id: number;
  hasPendingChanges?: boolean;
};

const RejectNewsModal = ({ id, hasPendingChanges }: Props) => {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReject = async () => {
    if (!reason.trim()) {
      NotiBase("error", "Vui lòng nhập lý do từ chối");
      return;
    }
    try {
      setLoading(true);
      await newsApi.reject(id, reason.trim());
      newsApi.revalidate();
      setOpen(false);
      setReason("");
    } catch (e: any) {
      NotiBase("error", e?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        type="default"
        className="news-action-btn"
        style={{
          width: 40,
          height: 40,
          background: "#ffffff",
          border: "1px solid #e5e5e5",
          borderRadius: 10,
        }}
        icon={<XIcon className="size-4 text-[#ff4d4f]" />}
        onClick={() => setOpen(true)}
      />
      <Modal
        title={hasPendingChanges ? "Từ chối bản cập nhật?" : "Từ chối bài viết?"}
        open={open}
        onCancel={() => {
          setOpen(false);
          setReason("");
        }}
        onOk={handleReject}
        confirmLoading={loading}
        okText="Xác nhận từ chối"
        okButtonProps={{ danger: true }}
        cancelText="Huỷ"
      >
        <p style={{ marginBottom: 8 }}>
          {hasPendingChanges
            ? "Bản sửa sẽ bị hủy, nội dung đang hiển thị công khai (nếu có) được giữ nguyên."
            : "Bài viết sẽ không được duyệt. Vui lòng nhập lý do để người đăng biết và chỉnh sửa lại."}
        </p>
        <Input.TextArea
          placeholder="Nhập lý do từ chối..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={4}
          autoFocus
        />
      </Modal>
    </>
  );
};

export default RejectNewsModal;