import { EyeOutlined, HistoryOutlined } from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Drawer,
  Input,
  List,
  message,
  Popconfirm,
  Row,
  Space,
  Tooltip,
  Typography,
} from "antd";
import Link from "next/link";
import { useState } from "react";
import HistoryModel from "@/lib/components/admin/property/modal/historyModal";
import BtnConfirm from "@/lib/components/shared/BtnConfirm";
import type { IPropResponse } from "@/lib/interfaces/Property/IProp";
import propertyApi from "@/services/api/property/propertyApi";
import { EPropTransferStatus } from "@/services/property/models/prop-transfer";
import propTransferApi from "@/services/property/propTransferApi";

const { TextArea } = Input;

const PropTransferDrawer = () => {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<string>();
  const [openHistory, setOpenHistory] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<IPropResponse>();

  const { data: countData } = propTransferApi.useCount({
    pageIndex: 1,
    pageSize: 30,
    Status: EPropTransferStatus.Pending,
  });

  const { data, mutate } = propTransferApi.useGet({
    pageIndex: 1,
    pageSize: 30,
    Status: EPropTransferStatus.Pending,
  });

  const handleHistoryClick = async (propId: number) => {
    try {
      const response = await propertyApi.getById(propId);
      setSelectedProperty(response.data);
      setOpenHistory(true);
    } catch (error) {
      console.error("Error fetching property:", error);
    }
  };

  const handleHistoryCancel = () => {
    setOpenHistory(false);
    setSelectedProperty(undefined);
  };

  return (
    <>
      <Badge count={countData?.data}>
        <Button onClick={() => setOpen(true)}>Danh sách chuyển đổi</Button>
      </Badge>
      <Drawer
        title={<Typography.Text>DANH SÁCH CHUYỂN ĐỔI</Typography.Text>}
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        width={450}
      >
        <List
          grid={{
            gutter: 12,
            column: 1,
          }}
          dataSource={data?.data}
          renderItem={(item) => (
            <List.Item>
              <Card
                type="inner"
                title={<Typography.Text>Mã BĐS {item.PropId}</Typography.Text>}
                extra={
                  <Button
                    icon={<HistoryOutlined />}
                    onClick={() => handleHistoryClick(item.PropId)}
                  >
                    Lịch sử
                  </Button>
                }
              >
                <div
                  style={{
                    backgroundColor: "#f9fafb",
                    padding: 12,
                    marginBottom: 12,
                  }}
                >
                  <Row justify={"space-between"}>
                    <Typography.Text type="secondary">
                      Người nhập cũ
                    </Typography.Text>
                    <Typography.Text type="secondary">
                      Người nhập mới
                    </Typography.Text>
                  </Row>
                  <Row justify={"space-between"}>
                    <Typography.Text>{item.OlddUserName}</Typography.Text>
                    <Typography.Text>{"=>"}</Typography.Text>
                    <Typography.Text>{item.NewdUserName}</Typography.Text>
                  </Row>
                </div>
                <Space direction="vertical" size={0}>
                  <Typography.Text>Lý do chuyển đổi: </Typography.Text>
                  <Typography.Text>{item.RequestNotes}</Typography.Text>
                </Space>
                <Divider />

                <Row gutter={8}>
                  <Col flex="auto">
                    <Popconfirm
                      title="Từ chối chuyển đổi"
                      description={
                        <TextArea
                          placeholder="Nhập lý do từ chối"
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                        />
                      }
                      onConfirm={async () => {
                        if (!reason) {
                          message.error("Vui lòng nhập lý do từ chối");
                          return;
                        }
                        await propTransferApi.approve({
                          Id: item.Id,
                          Status: EPropTransferStatus.Rejected,
                          Notes: reason,
                        });
                        mutate();
                      }}
                      onCancel={() => {
                        setReason(undefined);
                      }}
                      okText="Xác nhận"
                      cancelText="Hủy"
                    >
                      <Button block danger>
                        Từ chối
                      </Button>
                    </Popconfirm>
                  </Col>
                  <Col flex="auto">
                    <BtnConfirm
                      block
                      type="text"
                      btnType="primary"
                      btnText="Đồng ý"
                      title="Duyệt chuyển đổi"
                      onOkClick={async () => {
                        await propTransferApi.approve({
                          Id: item.Id,
                          Status: EPropTransferStatus.Approved,
                        });
                        mutate();
                      }}
                    />
                  </Col>
                  <Col>
                    <Tooltip title="Xem chi tiết">
                      <Link
                        href={`/admin/property/${item.PropId}`}
                        target="_blank"
                      >
                        <Button icon={<EyeOutlined />} />
                      </Link>
                    </Tooltip>
                  </Col>
                </Row>
              </Card>
            </List.Item>
          )}
        />
      </Drawer>

      <HistoryModel
        isModalOpen={openHistory}
        handleCancel={handleHistoryCancel}
        model={selectedProperty}
      />
    </>
  );
};

export default PropTransferDrawer;
