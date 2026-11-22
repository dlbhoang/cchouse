import { Alert, Button, Input, Tooltip } from "antd";
import type { ModalProps } from "antd";
import { SquarePen, StickyNote } from "lucide-react";
import { useState } from "react";
import { useSWRConfig } from "swr";

import { Modal as LucideModal } from "@/lib/components/antd-lucide";
import HistoryTree from "@/lib/components/shared/HistoryTree";
import styles from "@/lib/components/shared/HistoryTree/history.module.css";

type Props = {
  value: string;
  tableName?: string;
  showTitle?: boolean;
  historyId?: number;
  address?: string;
  handleChange?: (note?: string) => void | Promise<void>;
  readOnly?: boolean;
  noteCount?: number;
};

const NoteModal = ({
  value,
  tableName = "tblProp",
  showTitle,
  historyId,
  address,
  handleChange,
  readOnly = false,
  noteCount,
  title,
  ...props
}: Props & ModalProps) => {
  const [screen, setScreen] = useState<"history" | "add" | null>(null);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);
  const { mutate } = useSWRConfig();
  const editing = screen === "add";
  const subtitle = address ? <>{title} - Địa chỉ: {address}</> : title;

  const open = () => {
    setNote(value ?? "");
    setSaveFailed(false);
    setScreen(historyId || readOnly ? "history" : "add");
  };

  const save = async () => {
    if (!handleChange) return;
    setSaving(true);
    setSaveFailed(false);
    try {
      await handleChange(note);
      if (historyId) {
        await mutate(
          (key) => Array.isArray(key) && key[0] === "history" && key[1] === tableName && key[2] === historyId,
          undefined,
          { revalidate: true },
        );
      }
      setScreen(historyId ? "history" : null);
    } catch {
      setSaveFailed(true);
    } finally {
      setSaving(false);
    }
  };

  const add = () => {
    setNote(historyId ? "" : value);
    setSaveFailed(false);
    setScreen("add");
  };

  return (
    <>
      <Tooltip title={noteCount === undefined ? "Ghi chú" : `${noteCount} ghi chú nội bộ`}>
        <Button
          type="text"
          size="small"
          aria-label="Lịch sử ghi chú"
          icon={<StickyNote size={15} />}
          onClick={open}
        >
          {showTitle ? "Lịch sử" : undefined}
        </Button>
      </Tooltip>
      <LucideModal
        {...props}
        className={[styles.dialog, editing ? styles.addNote : styles.noteHistory, props.className].filter(Boolean).join(" ")}
        open={screen !== null}
        centered={editing}
        style={editing ? undefined : { top: 59 }}
        styles={{ mask: { background: "rgba(0,0,0,0.3)" } }}
        width={768}
        closable={!saving}
        keyboard={!saving}
        maskClosable={!saving}
        onCancel={() => setScreen(editing && historyId ? "history" : null)}
        title={
          <>
            {editing ? "THÊM GHI CHÚ NỘI BỘ" : "LỊCH SỬ GHI CHÚ"}
            {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
          </>
        }
        footer={handleChange ? (
          <Button
            type="primary"
            className={styles.noteAction}
            icon={<SquarePen size={16} />}
            loading={saving}
            disabled={editing && Boolean(historyId) && !note.trim()}
            onClick={editing ? save : add}
          >
            {editing && !historyId ? "Cập nhật" : "Thêm"}
          </Button>
        ) : null}
      >
        {editing ? (
          <div className={styles.noteEditor}>
            <Input.TextArea
              aria-label="Nội dung ghi chú"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              maxLength={1000}
              showCount={{ formatter: ({ count, maxLength }) => `${count}/${maxLength} kí tự` }}
              disabled={saving}
              placeholder="Nhập ghi chú nội bộ..."
              style={{ height: 168, resize: "none" }}
            />
            {saveFailed && <Alert type="error" showIcon message="Không lưu được ghi chú. Vui lòng thử lại." />}
          </div>
        ) : historyId && screen === "history" ? (
          <HistoryTree instanceId={historyId} TableName={tableName} noteOnly />
        ) : (
          <div style={{ whiteSpace: "pre-wrap" }}>{value || "Chưa có ghi chú"}</div>
        )}
      </LucideModal>
    </>
  );
};

export default NoteModal;
