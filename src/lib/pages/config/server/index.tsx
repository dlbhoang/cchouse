"use client";

import { Form, Input, Modal, Space, Typography } from "antd";
import { Server, Save, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { NotiBase } from "@/lib/components/shared/NotiBase";
import serverConfigApi from "@/services/api/serverConfigApi";

type ServerConfigModalProps = {
  open: boolean;
  onClose: () => void;
};

const ServerConfigModal = ({ open, onClose }: ServerConfigModalProps) => {
  const [form] = Form.useForm<{ ServerIp: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    setLoading(true);
    serverConfigApi
      .getServerIp()
      .then((result) => form.setFieldsValue({ ServerIp: result.data }))
      .finally(() => setLoading(false));
  }, [form, open]);

  const handleSubmit = async ({ ServerIp }: { ServerIp: string }) => {
    setSaving(true);
    try {
      const result = await serverConfigApi.updateServerIp(ServerIp.trim());
      NotiBase("success", result.message ?? "Cập nhật thành công");
      form.setFieldsValue({ ServerIp: result.data });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title={
        <Space align="start" size={14}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
              boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)",
              flexShrink: 0,
            }}
          >
            <Server size={22} color="#fff" />
          </div>
          <div>
            <Typography.Title level={4} style={{ margin: 0, color: "#1e293b" }}>
              Địa chỉ máy chủ
            </Typography.Title>
            <Typography.Text type="secondary" style={{ fontSize: 13 }}>
              Cấu hình địa chỉ IP máy chủ dùng để kiểm tra truy cập
            </Typography.Text>
          </div>
        </Space>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      styles={{
        header: { paddingBottom: 20, marginBottom: 8 },
        content: { borderRadius: 16, padding: "28px 28px 24px" },
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
        style={{ marginTop: 8 }}
      >
        <Form.Item
          label={<span style={{ fontWeight: 500, color: "#334155" }}>Địa chỉ IP máy chủ</span>}
          name="ServerIp"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ IP" }]}
        >
          <Input
            size="large"
            prefix={<Server size={16} style={{ color: "#2563eb", marginRight: 4 }} />}
            placeholder="Ví dụ: 123.21.135.237"
            disabled={loading}
            style={{ borderRadius: 10 }}
          />
        </Form.Item>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 24 }}>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg"
          >
            Hủy
          </Button>
          <Button
            type="submit"
            disabled={saving || loading}
            className="rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? (
              <Save size={16} className="animate-spin" />
            ) : (
              <CheckCircle2 size={16} />
            )}
            {saving ? "Đang lưu..." : "Lưu cấu hình"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ServerConfigModal;