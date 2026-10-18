import { Input, Space, Typography } from "antd";
import type { ColumnsType } from "antd/lib/table";
import { ChevronDown, Check, SquarePenIcon, Trash2Icon, X } from "lucide-react";
import { useState } from "react";
import { mutate } from "swr";

import NewsConfirmButton from "../../news/confirm";
import TableNoPaging from "@/lib/components/shared/TableNoPaging";
import type { INewsType } from "@/services/api/news/INews";
import newsTypeApi from "@/services/api/news/newsTypeApi";

const { Text } = Typography;

type Props = {
  data: INewsType[];
  loading: boolean;
  onEditType?: (item: INewsType) => void;
  counts?: Record<string, number>;
};

export const NewsTypeTable = ({ data, loading, onEditType, counts }: Props) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [saving, setSaving] = useState(false);

  const handleEditClick = (item: INewsType) => {
    setEditingId(item.Id ?? null);
    setEditingName(item.Name ?? "");
    onEditType?.(item);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const confirmEdit = async (item: INewsType) => {
    const trimmed = editingName.trim();
    if (!trimmed || trimmed === item.Name) {
      cancelEdit();
      return;
    }
    setSaving(true);
    try {
      await newsTypeApi.update({ ...item, Name: trimmed });
      mutate(newsTypeApi.mutateKey);
      cancelEdit();
    } catch (e) {
      console.error("Failed to update news type:", e);
    } finally {
      setSaving(false);
    }
  };

  const columns: ColumnsType<INewsType> = [
    {
      title: "Loại chủ đề",
      dataIndex: "Name",
      render(value, record) {
        const isEditing = editingId === record.Id;

        if (isEditing) {
          return (
            <Input
              autoFocus
              className="news-type-edit-input"
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              onPressEnter={() => confirmEdit(record)}
              disabled={saving}
              suffix={
                <span className="news-type-edit-suffix">
                  ({counts?.[String(record.Id)] ?? record.NewsCount ?? 0}) <ChevronDown className="size-3.5" />
                </span>
              }
            />
          );
        }

        return (
          <Text className="news-type-name-text">
            {value} <span className="news-type-count">({counts?.[String(record.Id)] ?? record.NewsCount ?? 0})</span>
          </Text>
        );
      },
    },
    {
      key: "action",
      title: "Thao tác",
      width: 88,
      align: "center",
      render: (_value, record) => {
        const isEditing = editingId === record.Id;

        if (isEditing) {
          return (
            <div className="news-type-row-actions">
              <button
                type="button"
                className="news-type-action-btn confirm"
                aria-label="Lưu loại tin tức"
                onClick={() => confirmEdit(record)}
                disabled={saving || !editingName.trim()}
              >
                <Check className="size-6" />
              </button>
              <button
                type="button"
                className="news-type-action-btn cancel"
                aria-label="Hủy chỉnh sửa loại tin tức"
                onClick={cancelEdit}
                disabled={saving}
              >
                <X className="size-6" />
              </button>
            </div>
          );
        }

        return (
          <Space size={8}>
            <button
              type="button"
              className="news-type-icon-btn"
              aria-label="Chỉnh sửa loại tin tức"
              onClick={() => handleEditClick(record)}
            >
              <SquarePenIcon className="size-6" />
            </button>

            <NewsConfirmButton
              label="Xóa loại tin tức"
              className="news-type-delete-btn"
              title="Xác nhận xóa"
              description={<>Bạn có muốn xóa loại tin <strong>“{record.Name}”</strong>?</>}
              confirmText="Xóa"
              danger
              icon={<Trash2Icon className="size-6" />}
              onConfirm={async () => {
                await newsTypeApi.delete(record.Id ?? 0);
                mutate(newsTypeApi.mutateKey);
              }}
            />
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <TableNoPaging loading={loading} data={data} cols={columns} />
    </>
  );
};
