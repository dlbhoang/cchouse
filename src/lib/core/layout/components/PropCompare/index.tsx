import { Card, Col, Row, Space, Typography } from "antd";
import { XIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import { IPropCompare } from "@/lib/interfaces/Property/IPropCompare";
import { usePropStore } from "@/lib/stored/PropStored";

const PropItem = ({
  item,
  toggleCompare,
}: {
  item: IPropCompare;
  toggleCompare: (item: IPropCompare) => void;
}) => {
  return (
    <Card>
      <Row gutter={12}>
        <Col span={10}>
          <Image
            src={item.Image}
            alt="default_image"
            width={100}
            height={100}
          />
        </Col>
        <Col span={12}>
          <Space direction="vertical">
            <Typography.Text type="success" strong>
              {item.DisplayPrice}
            </Typography.Text>
            <Typography>{item.DisplayAddress}</Typography>
          </Space>
        </Col>
      </Row>
      <Button
        variant="ghost"
        className="rounded-full absolute top-3 right-2"
        onClick={() => toggleCompare(item)}
        size="icon-sm"
      >
        <XIcon />
      </Button>
    </Card>
  );
};

const PropCompare = () => {
  const router = useRouter();
  const { listCompare, toggleCompare, reset, closeCompare } = usePropStore();

  return (
    <Row
      gutter={[12, 12]}
      align="middle"
      justify="space-between"
      style={{ padding: 20, width: "100%" }}
    >
      <Col>
        <Space>
          <Typography.Title
            level={4}
            style={{ margin: 0, textTransform: "uppercase" }}
          >
            Có {listCompare.length} BĐS được chọn để so sánh:
          </Typography.Title>
          <Typography.Text type="danger" italic>
            * Tối đa 5 BĐS cùng lúc
          </Typography.Text>
        </Space>
      </Col>
      <Col>
        <Space>
          <Button
            onClick={() => {
              closeCompare();
              router.push(AppRoutes.propCompare.url);
            }}
          >
            So sánh
          </Button>
          <Button variant="destructive" onClick={reset}>
            Xoá tất cả
          </Button>
        </Space>
      </Col>
      <Col span={24} style={{ display: "flex", overflow: "auto" }}>
        {listCompare.map((e) => (
          <Col xs={24} xl={6}>
            <PropItem item={e} toggleCompare={toggleCompare} />
          </Col>
        ))}
      </Col>

      <Button
        className="rounded-full absolute -top-4 left-5"
        variant="outline"
        size="icon-sm"
        onClick={closeCompare}
      >
        <XIcon />
      </Button>
    </Row>
  );
};

export default PropCompare;
