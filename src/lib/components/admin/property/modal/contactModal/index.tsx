
import {
  Button,
  Col,
  Collapse,
  Descriptions,
  Modal,
  Row,
  Space,
  Tag,
  Typography,
} from "antd";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { mutate } from "swr";

import RenderArea from "@/lib/components/shared/CustomRender/RenderArea";
import RenderPhone from "@/lib/components/shared/CustomRender/RenderPhone";
import { TransStatusConfirm } from "@/lib/components/shared/MyConfirm";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import { IPropAdminOpts } from "@/lib/interfaces/filter/ISearchOptions";
import { IPropResponse } from "@/lib/interfaces/Property/IProp";
import propertyApi from "@/services/api/property/propertyApi";
import PropertySubTable from "../../table/subTable";
import { MapIcon } from "lucide-react";

const { Link } = Typography;
const { Panel } = Collapse;

type Props = {
  isModalOpen: boolean;
  model: IPropResponse;
  handleCancel: () => void;
  onOpenDetail?: (id: number) => void;
};

const ContactModal = ({
  isModalOpen,
  model,
  handleCancel,
  onOpenDetail,
}: Props) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [showMap, setShowMap] = useState<boolean>(false);

  const [propOfCustomer, setPropOfCustomer] = useState<IPropResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalRow, setTotalRow] = useState(0);
  const [data, setData] = useState<IPropResponse>();
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const detail = await propertyApi.getById(model.Id);
      setData(detail.data);

      const result = await propertyApi.get({
        pageIndex: 1,
        pageSize: 100,
        search: model.CustomerPhone.toString(),
        TransType: model.TransType,
      } as IPropAdminOpts);

      setPropOfCustomer(result.data);
      setTotalRow(result.totalRow ?? 0);
      setLoading(false);
    };
    fetch();
  }, [model]);

  const items = [
    {
      key: "1",
      label: `Tìm được ${totalRow} BĐS trong kho dữ liệu`,
      children: <PropertySubTable data={propOfCustomer} loading={loading} />,
    },
  ];

  return (
    data && (
      <Modal
        title={
          <Row
            justify="space-between"
            style={{ marginRight: 15 }}
            gutter={[12, 12]}
          >
            <Col>
              <Space>
                <Tag>{`Mã: ${data?.Id}`}</Tag>
                {`${data?.CustomerTypeName}: ${data?.CustomerName}`}
              </Space>
            </Col>
            <Col>
              <Space>
                <Button
                  style={{ backgroundColor: "orange" }}
                  onClick={() =>
                    router.push(`${AppRoutes.feed.url}/add?propId=${data.Id}`)
                  }
                >
                  Đăng tin
                </Button>
                <Button
                  onClick={() => {
                    handleCancel();
                    if (onOpenDetail) {
                      onOpenDetail(data.Id);
                    } else {
                      router.push(`${AppRoutes.property.url}/${data.Id}`);
                    }
                  }}
                >
                  Chỉnh sửa
                </Button>
              </Space>
            </Col>
          </Row>
        }
        open={isModalOpen}
        width={1200}
        onCancel={() => {
          setData(undefined);
          handleCancel();
        }}
        footer={
          <Row justify="space-between" gutter={[12, 12]}>
            <Col>
              <TransStatusConfirm
                propId={data.Id}
                transType={Number(data.TransType)}
                transStatus={data.Status}
                handleOkClick={async (val, reason) => {
                  await propertyApi.quickUpdate({
                    Id: data.Id,
                    Status: val,
                    Note: reason,
                  });
                  mutate(propertyApi.mutateKey);
                  handleCancel();
                }}
              />
            </Col>
            <Col>
              <Button
                icon={<MapIcon className="size-4" />}
                type="dashed"
                onClick={() => setShowMap(!showMap)}
                disabled={!data.PropAddress?.PlaceId}
              >
                {`Xem bản đồ ${
                  !data.PropAddress.PlaceId ? "(chưa có vị trí)" : ""
                }`}
              </Button>
            </Col>
            {showMap && data.PropAddress.PlaceId && (
              <Col span={24}>
                <iframe
                  title="my_embed_goong"
                  height={500}
                  width="100%"
                  src={`https://maps.goong.io/?pid=${data.PropAddress.PlaceId}`}
                />
              </Col>
            )}
          </Row>
        }
      >
        <Row>
          <Col span={24}>
            <Descriptions
              layout="horizontal"
              size="small"
              column={{ xs: 1, lg: 1, xl: 2 }}
              // bordered
            >
              <Descriptions.Item label="Địa chỉ" span={2}>
                {`${data.PropAddress.AddressNumber} ${data.PropAddress.StreetName}, ${data.PropAddress.WardName}, ${data.PropAddress.DistrictName}`}
              </Descriptions.Item>
              <Descriptions.Item label="Giá">
                {data?.DisplayPrice ?? "--"}
              </Descriptions.Item>
              <Descriptions.Item label="Diện tích TT">
                <RenderArea
                  area={data.Area}
                  length={data.Length}
                  width={data.Width}
                />
              </Descriptions.Item>
              <Descriptions.Item label="Kết cấu">
                {data.CustomDisplayStructures
                  ? data?.CustomDisplayStructures?.toString()
                  : "--"}
              </Descriptions.Item>
              <Descriptions.Item label="Vị trí">
                {data.PropAddress.LocationName}
              </Descriptions.Item>
              <Descriptions.Item label="Hướng">
                {data.PropAddress.DirectionName}
              </Descriptions.Item>

              <Descriptions.Item label="Pháp lý">
                {data?.PropAddress.DisplayLaws?.toString()}
              </Descriptions.Item>

              <Descriptions.Item label="Tiện ích">
                {data?.DisplayUtilities?.join(", ") ?? "--"}
              </Descriptions.Item>
              <Descriptions.Item label="Trang thiết bị">
                {data?.DisplayEquipments?.join(", ") ?? "--"}
              </Descriptions.Item>
              <Descriptions.Item label="Tình trạng nhà">
                {data?.PropAddress.StatusUsageName ?? "--"}
              </Descriptions.Item>
              <Descriptions.Item label="Điện thoại">
                {[1, 2].includes(session?.user.RoleId ?? 0) ||
                session?.user.Id === data?.UserAdminId ||
                !data?.IsHidePhone ? (
                  <RenderPhone
                    phones={data?.CustomerPhone.toString().split(",")}
                  />
                ) : (
                  <span>SĐT đang bị ẩn, vui lòng liên hệ quản lý</span>
                )}
              </Descriptions.Item>
            </Descriptions>
          </Col>
          <Col span={24}>
            <Collapse ghost size="small">
              {items.map((item) => (
                <Panel
                  header={
                    <Row justify="space-between">
                      <Col>
                        <Space style={{ fontWeight: 700 }}>{item.label}</Space>
                      </Col>
                      <Col>
                        <Link
                          href={`${AppRoutes.property.url}?Search=${data.CustomerPhone}`}
                        >
                          Xem tất cả
                        </Link>
                      </Col>
                    </Row>
                  }
                  key={item.key}
                >
                  {item.children}
                </Panel>
              ))}
            </Collapse>
          </Col>
        </Row>
      </Modal>
    )
  );
};

export default ContactModal;
