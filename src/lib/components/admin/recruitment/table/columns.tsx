/* eslint-disable no-nested-ternary */
import { Space, Typography } from "antd";
import { ColumnsType } from "antd/lib/table";
import { Trash2Icon } from "lucide-react";
import Link from "next/link";
import { mutate } from "swr";
import BtnConfirm from "@/lib/components/shared/BtnConfirm";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import { FormatDate } from "@/lib/core/utils/myFormat";
import { IRecruitmentResponse } from "@/services/api/recruitment/IRecruitment";
import recruitmentApi from "@/services/api/recruitment/recruitmentApi";

const { Text } = Typography;

const url = `${AppRoutes.recruitment.url}`;

const columns: ColumnsType<IRecruitmentResponse> = [
  {
    title: "Mã",
    dataIndex: "Id",
    align: "center",
    render(value, record) {
      return (
        <Space direction="vertical">
          <Link href={`${url}/${record.Id}`}>
            <Text>{value}</Text>
          </Link>
        </Space>
      );
    },
  },
  {
    title: "Vị trí",
    dataIndex: "Role",
    render(value, record) {
      return (
        <Space direction="vertical">
          <Link href={`${url}/${record.Id}`}>{value}</Link>
        </Space>
      );
    },
  },
  {
    title: "Số lượng",
    dataIndex: "Quantity",
    align: "center",
    render(value, record) {
      return (
        <Space direction="vertical">
          <Link href={`${url}/${record.Id}`}>
            <Text>{value}</Text>
          </Link>
        </Space>
      );
    },
  },
  {
    title: "Khu vực",
    dataIndex: "Places",
    render(value: string[], record) {
      return (
        <Space direction="vertical">
          <Link href={`${url}/${record.Id}`}>
            <Text>{value.join(", ")}</Text>
          </Link>
        </Space>
      );
    },
  },
  {
    title: "Hạn nộp hồ sơ",
    dataIndex: "EndDate",
    render(value, record) {
      return <Space direction="vertical">{FormatDate(value)}</Space>;
    },
  },
  {
    title: "Số lượng ứng viên",
    dataIndex: "CandidateCount",
    align: "center",
    render(value, record) {
      return (
        <Space direction="vertical">
          <Link href={`${url}/${record.Id}?tab=candidates`}>{value}</Link>
        </Space>
      );
    },
  },
  {
    key: "Action",
    title: "Thao tác",
    dataIndex: "CreatedDate",
    render(value, record) {
      return (
        <Space>
          <BtnConfirm
            onOkClick={async () => {
              await recruitmentApi.delete(record.Id ?? 0);
              mutate(recruitmentApi.mutateKey);
            }}
            type="icon"
            icon={<Trash2Icon className="size-4" />}
          />
        </Space>
      );
    },
  },
];

export default columns;
