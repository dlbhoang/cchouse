import {
  Button,
  Card,
  Col,
  Descriptions,
  type DescriptionsProps,
  Row,
} from "antd";
import ReadMore from "@/lib/components/shared/ReadMore";
import { appConst } from "@/lib/core/configs/appConst";
import type { IReportSpamResponse } from "@/services/api/reportSpam/IReportSpam";
import { FormatDateTime } from "../../../../core/utils/myFormat";

type Props = {
  data: IReportSpamResponse[];
  totalRow: number;
};

const Item = ({ item }: { item: IReportSpamResponse }) => {
  const content = item.Descriptions
    ? [...item.SpamTypeNames, item.Descriptions]
    : item.SpamTypeNames;

  const items: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "Họ & tên",
      children: item.ReporterName,
    },
    {
      key: "2",
      label: "SĐT",
      children: item.ReporterPhone,
    },
    {
      key: "3",
      label: "Email",
      span: 2,
      children: item.ReporterEmail || appConst.TEXT_DEFAULT,
    },
    {
      key: "4",
      label: "Ngày gửi",
      span: 2,
      children: FormatDateTime(item.CreatedDate),
    },
  ];
  return (
    <Card
      title={`Mã tin: ${item.FeedId}`}
      extra={<Button type="link">Xem tin</Button>}
      actions={[]}
    >
      <ReadMore>{content.join(", ")}</ReadMore>
      <Descriptions
        size="small"
        items={items}
        column={{ xs: 2, md: 2, lg: 2, xl: 2 }}
      />
    </Card>
  );
};

const ReportSpamList = ({ data, totalRow }: Props) => {
  return (
    <Row gutter={[12, 12]}>
      {data.map((e) => (
        <Col key={e.Id} xs={24} md={6}>
          <Item item={e} />
        </Col>
      ))}
    </Row>
  );
};

export default ReportSpamList;
