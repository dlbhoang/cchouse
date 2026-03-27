"use client";
import {
  Button,
  Card,
  Col,
  Descriptions,
  type DescriptionsProps,
  Row,
  Space,
  Tabs,
  type TabsProps,
  Tag,
  Typography,
} from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BottomFixed from "@/lib/components/shared/BottomFixed";
import { appConst } from "@/lib/core/configs/appConst";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import TitlePage from "@/lib/core/layout/components/TitlePage";
import { FormatDate, FormatNumber } from "@/lib/core/utils/myFormat";
import { useAdminContext } from "@/lib/stored";
import type { IRecruitmentResponse } from "@/services/api/recruitment/IRecruitment";
import recruitmentApi from "@/services/api/recruitment/recruitmentApi";
import ApplyList from "./apply-list";

type Props = {
  id: number;
  tab?: string;
};

const RecruitmentDetailPage = ({ id, tab }: Props) => {
  const router = useRouter();
  const { smallScreen } = useAdminContext();
  const [data, setData] = useState<IRecruitmentResponse>();

  useEffect(() => {
    const fetch = async () => {
      if (id) {
        const res = await recruitmentApi.getById(Number(id));
        setData(res.data);
      }
    };
    fetch();
  }, [id]);

  const items: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "Khu vực",
      children: data?.Places?.join(", "),
    },
    {
      key: "3",
      label: "Mức lương",
      children: `${FormatNumber(data?.FromSalary)} - ${FormatNumber(
        data?.ToSalary
      )} VNĐ`,
    },
    {
      key: "2",
      label: "Số lượng",
      children: data?.Quantity,
    },

    {
      key: "4",
      label: "Hạn nộp",
      children: FormatDate(data?.EndDate?.toString()),
    },
  ];

  const tabItems: TabsProps["items"] = [
    {
      key: "1",
      label: "Mô tả công việc",
      children: data?.Content,
    },
    {
      key: "2",
      label: "Yêu cầu",
      children: data?.Requirement ?? appConst.TEXT_DEFAULT,
    },
    {
      key: "3",
      label: "Quyền lợi",
      children: data?.Benefit ?? appConst.TEXT_DEFAULT,
    },
    {
      key: "4",
      label: "Liên hệ",
      children: (
        <Space direction="vertical">
          <Typography.Text>SĐT: {data?.ContactPhone}</Typography.Text>
          <Typography.Text>Email: {data?.ContactEmail}</Typography.Text>
          <Typography.Text>Địa chỉ: {data?.ContactAddress}</Typography.Text>
        </Space>
      ),
    },
    {
      key: "candidates",
      label: `Ứng viên (${data?.CandidateCount ?? 0})`,
      children: <ApplyList id={Number(id)} />,
    },
  ];

  const statusColor = data?.StatusName === "Đang tuyển" ? "green" : "red";

  return (
    <Row gutter={[12, 12]} justify={"space-between"}>
      <Col>
        <TitlePage title="Vị trí tuyển dụng" />
      </Col>

      <Col span={24}>
        <Card>
          <Descriptions
            column={{ xs: 1, sm: 1, md: 2, xl: 4 }}
            title={data?.Role}
            items={items}
            extra={<Tag color={statusColor}>{data?.StatusName}</Tag>}
          />
        </Card>
      </Col>
      <Col span={24}>
        <Card>
          <Tabs defaultActiveKey={tab?.toString() ?? "1"} items={tabItems} />
        </Card>
      </Col>
      <BottomFixed>
        <Space>
          <Button
            type="primary"
            size="large"
            block={smallScreen}
            onClick={() =>
              router.push(`${AppRoutes.recruitment.url}/edit/${data?.Id}`)
            }
          >
            Chỉnh sửa
          </Button>
        </Space>
      </BottomFixed>
    </Row>
  );
};

export default RecruitmentDetailPage;
