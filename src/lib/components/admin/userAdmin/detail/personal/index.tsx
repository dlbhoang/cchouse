import { Descriptions } from "antd";
import dayjs from "dayjs";
import ImagesPreview from "@/lib/components/shared/ImagesPreview";
import { appConst } from "@/lib/core/configs/appConst";
import { useAdminContext } from "@/lib/stored";
import { IUserAdminResponse } from "@/services/api/userAdmin/IUserAdmin";
import { fileServices } from "../../../../../../services/api/services/fileServices";

type Props = {
  data: IUserAdminResponse;
};

const PersonalDetail = ({ data }: Props) => {
  const { enumList } = useAdminContext();
  const { Sex, Literacy } = enumList;

  return (
    <Descriptions layout="horizontal" size="small" column={{ xs: 1, lg: 3 }}>
      <Descriptions.Item label="Email">{data?.Email}</Descriptions.Item>
      <Descriptions.Item label="Giới tính">
        {Sex.find((x) => x.Value === data?.Sex)?.Name}
      </Descriptions.Item>
      <Descriptions.Item label="Ngày sinh">
        {dayjs(data?.DateOfBirth).format(appConst.DATE_FORMAT)}
      </Descriptions.Item>
      <Descriptions.Item label="Trình độ">
        {Literacy.find((x) => x.Value === data?.Literacy)?.Name ?? "Không có"}
      </Descriptions.Item>
      <Descriptions.Item label="Bảo hiểm" span={2}>
        {data?.Insurrance ? "Có" : "Không"}
      </Descriptions.Item>
      <Descriptions.Item label="Địa chỉ thường trú" span={3}>
        {data?.Address ?? "Không có"}
      </Descriptions.Item>
      <Descriptions.Item label="Địa chỉ tạm trú" span={3}>
        {data?.TempAddress ?? "Không có"}
      </Descriptions.Item>

      {data?.IdentityImages && (
        <Descriptions.Item label="CMND/CCCD" span={3}>
          <ImagesPreview
            images={fileServices.mapFromString(data.IdentityImages) || []}
            imgWidth={200}
          />
        </Descriptions.Item>
      )}

      {data?.Images && (
        <Descriptions.Item label="Hồ sơ" span={3}>
          <ImagesPreview
            images={fileServices.mapFromString(data.Images) || []}
            imgWidth={200}
          />
        </Descriptions.Item>
      )}
    </Descriptions>
  );
};

export default PersonalDetail;
