/* eslint-disable no-nested-ternary */
import { Badge } from "antd";
import type { ColumnsType } from "antd/lib/table";

import dayjs from "dayjs";
import { Edit, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { calculateDuration } from "@/lib/utils";
import type { ILeaveResponse } from "../types/leave-response";

type Props = {
  onDetail: (item: ILeaveResponse) => void;
  onEdit: (item: ILeaveResponse) => void;
};

const columns = ({ onDetail, onEdit }: Props): ColumnsType<ILeaveResponse> => {
  return [
    {
      title: "Mã",
      dataIndex: "Id",
      align: "center",
    },

    {
      title: "Người xin nghỉ",
      dataIndex: "UserRequestName",
      render(value, record) {
        return (
          <div className="flex flex-col gap-2">
            <p>{value}</p>
            <span className="text-xs text-muted-foreground">
              Ngày tạo: {dayjs(record.CreatedDate).format("DD/MM/YYYY HH:mm")}
            </span>
          </div>
        );
      },
    },
    {
      title: "Ngày nghỉ",
      dataIndex: "StartDate",
      render(value, record) {
        return (
          <div className="flex flex-col gap-2">
            <p className="text-sm">
              Tổng: <strong>{calculateDuration(value, record.EndDate)}</strong>{" "}
              ngày nghỉ
            </p>
            <span className="text-xs">
              {dayjs(value).format("DD/MM/YYYY")} -{" "}
              {dayjs(record.EndDate).format("DD/MM/YYYY")}
            </span>
          </div>
        );
      },
    },
    {
      title: "Lý do nghỉ",
      dataIndex: "RequestNotes",
      width: 400,
    },

    {
      title: "Người duyệt",
      dataIndex: "UserApprovedName",
      render(value, record) {
        if (!value) {
          return null;
        }

        return (
          <div className="flex flex-col gap-2">
            <p>{value}</p>
            <span className="text-xs">
              {dayjs(record.ApprovedDate).format("DD/MM/YYYY HH:mm")}
            </span>
          </div>
        );
      },
    },

    {
      title: "Trạng thái",
      dataIndex: "StatusName",
      render(value, record) {
        const data = value.toLowerCase();
        return (
          <div className="flex flex-col gap-2">
            <Badge
              status={
                data === "chờ duyệt"
                  ? "processing"
                  : data === "đã duyệt"
                  ? "success"
                  : "error"
              }
              text={value}
            />
            {record.ApprovedNotes && (
              <span className="text-xs text-muted-foreground">
                {record.ApprovedNotes}
              </span>
            )}
          </div>
        );
      },
    },
    // Chi tiết
    {
      title: "Chi tiết",
      dataIndex: "ApprovedNotes",
      render(value, record) {
        return (
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => onDetail(record)}
              >
                <Eye />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => onEdit(record)}
              >
                <Edit />
              </Button>
            </div>
          </div>
        );
      },
    },
  ];
};

export default columns;
