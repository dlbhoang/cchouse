import {
  Image,
  Input,
  Modal,
  ModalProps,
  Space,
  Tabs,
  TabsProps,
  Tooltip,
  Typography,
  Button,
  Badge,
} from "antd";
import { useEffect, useState } from "react";
import HistoryTree from "@/lib/components/shared/HistoryTree";

const { TextArea } = Input;
const { Text } = Typography;

type Props = {
  value: string;
  tableName?: string;
  showTitle?: boolean;
  historyId?: number;
  handleChange: (note?: string) => void;
  readOnly?: boolean;
  noteCount?: number;
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .slice(-2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

const NoteModal = ({
  value,
  tableName,
  showTitle,
  historyId,
  handleChange,
  readOnly = false,
  noteCount,
  ...props
}: Props & ModalProps) => {
  const [note, setNote] = useState(value);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [open, setOpen] = useState(false);

  const isReadOnly = readOnly || (!!value?.trim() && !!historyId);
  const showHistory = isReadOnly && !adding;

  const [activeTab, setActiveTab] = useState(showHistory ? "2" : "1");

  const historyTab: TabsProps["items"] = historyId
    ? [
        {
          key: "2",
          label: (
            <Space size={6}>
              <span>Lịch sử ghi chú</span>
              {noteCount !== undefined && (
                <Badge
                  count={noteCount}
                  style={{
                    backgroundColor: "#EAF3DE",
                    color: "#3B6D11",
                    fontSize: 11,
                    fontWeight: 500,
                    boxShadow: "none",
                  }}
                />
              )}
            </Space>
          ),
          children: (
            <HistoryTree
              refresh={activeTab === "2"}
              instanceId={historyId}
              TableName={tableName || "tblProp"}
              oldTableName="tblProperty"
              noteOnly
            />
          ),
        },
      ]
    : [];

  const items: TabsProps["items"] = showHistory
    ? historyTab
    : [
        {
          key: "1",
          label: "Ghi chú nội bộ",
          children: (
            <TextArea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={5}
              placeholder="Nhập ghi chú nội bộ..."
              style={{ resize: "none" }}
            />
          ),
        },
        ...historyTab,
      ];

  const handleOk = async () => {
    try {
      setConfirmLoading(true);
      handleChange(note);
    } finally {
      setConfirmLoading(false);
      setAdding(false);
      setOpen(false);
    }
  };

  const handleCancel = () => {
    if (adding) {
      setAdding(false);
      setNote(value);
      setActiveTab("2");
    } else {
      setOpen(false);
    }
  };

  useEffect(() => {
    setNote(value);
  }, [value]);

  useEffect(() => {
    setActiveTab(showHistory ? "2" : "1");
  }, [showHistory]);

  const modalTitle = (
    <Space align="center" size={10}>
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 8,
          background: "#EAF3DE",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#3B6D11",
          fontSize: 16,
          flexShrink: 0,
        }}
      >
        📝
      </div>
      <div style={{ lineHeight: 1.3 }}>
        <div style={{ fontWeight: 500, fontSize: 15 }}>
          {(props.title as string) || "Ghi chú"}
        </div>
        {noteCount !== undefined && (
          <div style={{ fontSize: 12, color: "#888", fontWeight: 400 }}>
            {noteCount} ghi chú nội bộ
          </div>
        )}
      </div>
    </Space>
  );

  const footerReadOnly = (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Button
        type="primary"
        icon={<span style={{ fontSize: 16, lineHeight: 1 }}>+</span>}
        style={{
          background: "#639922",
          borderColor: "#639922",
          fontWeight: 500,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
        onClick={() => {
          setNote("");
          setAdding(true);
          setActiveTab("1");
        }}
      >
        Thêm ghi chú mới
      </Button>
      <Button onClick={() => setOpen(false)}>Đóng</Button>
    </div>
  );

  const footerEdit = (
    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
      <Button onClick={handleCancel}>{adding ? "Hủy" : "Đóng"}</Button>
      <Button
        type="primary"
        loading={confirmLoading}
        onClick={handleOk}
        style={{ background: "#639922", borderColor: "#639922" }}
      >
        Cập nhật
      </Button>
    </div>
  );

  return (
    <>
      <Tooltip title="Ghi chú">
        <Space onClick={() => setOpen(true)} style={{ cursor: "pointer" }}>
          <Image src="/stickynote.png" alt="Icon" width={15} preview={false} />
          {showTitle && "Lịch sử"}
        </Space>
      </Tooltip>

      <Modal
        {...props}
        title={modalTitle}
        open={open}
        confirmLoading={confirmLoading}
        width={600}
        onCancel={handleCancel}
        footer={showHistory ? footerReadOnly : footerEdit}
        styles={{
          header: {
            borderBottom: "1px solid #f0f0f0",
            paddingBottom: 12,
            marginBottom: 0,
          },
          body: { padding: "0 24px" },
          footer: {
            borderTop: "1px solid #f0f0f0",
            background: "#fafafa",
            borderRadius: "0 0 8px 8px",
            padding: "12px 24px",
          },
        }}
      >
        <Tabs
          activeKey={activeTab}
          items={items}
          onChange={setActiveTab}
          style={{ marginTop: 4 }}
          tabBarStyle={{ marginBottom: 12 }}
        />
      </Modal>
    </>
  );
};

export default NoteModal;