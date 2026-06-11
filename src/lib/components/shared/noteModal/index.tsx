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
};

const NoteModal = ({
  value,
  tableName,
  showTitle,
  historyId,
  handleChange,
  ...props
}: Props & ModalProps) => {
  const [note, setNote] = useState(value);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const [open, setOpen] = useState(false);
  const items: TabsProps["items"] = historyId
    ? [
        {
          key: "1",
          label: <Text style={{ fontWeight: 500 }}>Ghi chú nội bộ</Text>,
          children: (
            <TextArea
              value={note}
              onChange={(val) => setNote(val.target.value)}
              rows={5}
            />
          ),
        },
        {
          key: "2",
          label: <Text style={{ fontWeight: 500 }}>Lịch sử ghi chú</Text>,
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
    : [
        {
          key: "1",
          label: <Text style={{ fontWeight: 500 }}>Ghi chú nội bộ</Text>,
          children: (
            <TextArea
              value={note}
              onChange={(val) => setNote(val.target.value)}
              rows={5}
            />
          ),
        },
      ];

  const handleOk = async () => {
    try {
      setConfirmLoading(true);
      handleChange(note);
    } finally {
      setConfirmLoading(false);
      setOpen(false);
    }
  };

  useEffect(() => {
    setNote(note);
  }, [note]);

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
        open={open}
        confirmLoading={confirmLoading}
        width={600}
        onCancel={() => setOpen(false)}
        onOk={handleOk}
        okText="Cập nhật"
        cancelText="Đóng"
      >
        <Tabs
          defaultActiveKey={activeTab}
          items={items}
          onChange={setActiveTab}
        />
      </Modal>
    </>
  );
};

export default NoteModal;
