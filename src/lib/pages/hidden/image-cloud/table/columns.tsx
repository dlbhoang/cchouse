import { Image, Space } from "antd";
import { Typography } from "antd/lib";
import type { ColumnsType } from "antd/lib/table";
import dayjs from "dayjs";
import { appConst } from "@/lib/core/configs/appConst";
import type { IImageCloud } from "@/services/api/image-cloud/model";

const columns: ColumnsType<IImageCloud> = [
  {
    title: "Tên ảnh",
    dataIndex: "Name",
    render(value, record) {
      return (
        <Space>
          <Image src={record.Thumbnail} width={50} height={50} alt={value} />
          <Typography.Paragraph ellipsis={{ rows: 2, tooltip: true }}>
            {value}
          </Typography.Paragraph>
        </Space>
      );
    },
  },

  {
    title: "Size",
    dataIndex: "ContentLength",
  },

  {
    title: "Loại ảnh",
    dataIndex: "ContentType",
  },

  {
    title: "Ngày tạo",
    dataIndex: "CreatedOn",
    render: (value) =>
      `${value ? dayjs(value).format(appConst.DATE_FORMAT) : ""}`,
  },

  {
    key: "action",
    title: "Thao tác",
    render: (value, record) => {
      return <Space></Space>;
    },
  },
  // {
  //     title: 'Người tạo/Ngày tạo',
  //     dataIndex: 'createdBy',
  //     render: (value, record, index) => {
  //         return (<>
  //             <Space direction="vertical">
  //                 {value}
  //                 <Text type="secondary">{moment(record.createdDate).format('DD-MM-YYYY')}</Text>
  //             </Space>
  //         </>)
  //     }
  // },
];

export default columns;
