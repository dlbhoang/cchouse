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
import { appConst } from "@/lib/core/configs/appConst";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import apartmentUnitApi from "@/services/api/apartment/unit/apartmentUnitApi";
import { IApartmentUnitResponse } from "@/services/api/apartment/unit/IApartmentUnit";
import ApartmentUnitSubTable from "../../table/subTable";

// import PropertySubTable from '../../table/subTable';

const { Link } = Typography;
const { Panel } = Collapse;

type Props = {
  isModalOpen: boolean;
  model: IApartmentUnitResponse;
  handleCancel: () => void;
};

const ContactModal = ({ isModalOpen, model, handleCancel }: Props) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [showMap, setShowMap] = useState<boolean>(false);

  const [propOfCustomer, setPropOfCustomer] = useState<
    IApartmentUnitResponse[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalRow, setTotalRow] = useState(0);
  const [data, setData] = useState<IApartmentUnitResponse>();
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const detail = await apartmentUnitApi.getById(model.Id);
      setData(detail.data);

      const result = await apartmentUnitApi.get({
        pageIndex: 1,
        pageSize: 100,
        search: model.Contact.Phone.toString(),
        TransType: model.TransType,
      });

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
      children: (
        <ApartmentUnitSubTable data={propOfCustomer} loading={loading} />
      ),
    },
  ];

  const contact = data?.Contact;

  return (
    contact && (
      <Modal
        title={
          <Row
            justify="space-between"
            style={{ marginRight: 15 }}
            gutter={[12, 12]}
          >
            <Col>
              <Space>
                <Tag>{`Mã: ${data?.Code}`}</Tag>
                {`${contact.TypeName}: ${contact?.Name}`}
              </Space>
            </Col>
            <Col>
              <Space>
                <Button
                  style={{ backgroundColor: "orange" }}
                  onClick={() =>
                    router.push(`${AppRoutes.feed.url}/add?unitId=${data.Id}`)
                  }
                >
                  Đăng tin
                </Button>
                <Button
                  onClick={() =>
                    router.push(`${AppRoutes.apartmentUnit.url}/${data.Id}`)
                  }
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
                  await apartmentUnitApi.quickUpdate({
                    Id: data.Id,
                    Status: val,
                    Note: reason,
                  });
                  mutate(apartmentUnitApi.mutateKey);
                  handleCancel();
                }}
              />
            </Col>
          </Row>
        }
      >
        <Descriptions
          layout="horizontal"
          size="small"
          column={{ xs: 1, lg: 1, xl: 2 }}
          // bordered
        >
          <Descriptions.Item label="Mã căn">{data.Code}</Descriptions.Item>
          <Descriptions.Item label="Giá">
            {contact.DisplayPrice ?? "--"}
          </Descriptions.Item>
          <Descriptions.Item label="Diện tích TT">
            <RenderArea area={data.Area ?? 0} />
          </Descriptions.Item>
          <Descriptions.Item label="Chung cư">
            {data.Apartment.Name} ({data.Apartment.DistrictName})
          </Descriptions.Item>
          <Descriptions.Item label="Hướng">
            {data.DirectionName ?? appConst.TEXT_DEFAULT}
          </Descriptions.Item>

          <Descriptions.Item label="Pháp lý">
            {data.Apartment.LawName}
          </Descriptions.Item>

          <Descriptions.Item label="Tiện ích">
            {data.Apartment?.DisplayUtilities.length === 0
              ? appConst.TEXT_DEFAULT
              : data.Apartment?.DisplayUtilities.join(", ")}
          </Descriptions.Item>
          {/* <Descriptions.Item label="Tình trạng nhà">
            {data?.PropAddress.StatusUsageName ?? '--'}
          </Descriptions.Item> */}
          <Descriptions.Item label="Điện thoại">
            {[1, 2].includes(session?.user.RoleId ?? 0) ||
            session?.user.Id === data?.UserAdminId ||
            !contact.IsHidePhone ? (
              <RenderPhone phones={contact.Phone.toString().split(",")} />
            ) : (
              <span>SĐT đang bị ẩn, vui lòng liên hệ quản lý</span>
            )}
          </Descriptions.Item>
        </Descriptions>
        <Collapse style={{ border: "none" }} ghost>
          {items.map((item) => (
            <Panel
              style={{ border: "none" }}
              header={
                <Row justify="space-between">
                  <Col>
                    <Space style={{ fontWeight: 700 }}>{item.label}</Space>
                  </Col>
                  <Col>
                    <Link
                      href={`${AppRoutes.apartmentUnit.url}?Search=${contact.Phone}`}
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
      </Modal>
    )
  );
};

export default ContactModal;
