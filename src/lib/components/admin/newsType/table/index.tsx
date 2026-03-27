import { Input, Space, Typography } from "antd";
import type { ColumnsType } from "antd/lib/table";
import { SquarePenIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { mutate } from "swr";
import BtnConfirm from "@/lib/components/shared/BtnConfirm";
import TableNoPaging from "@/lib/components/shared/TableNoPaging";
import type { INewsType } from "@/services/api/news/INews";
import newsTypeApi from "@/services/api/news/newsTypeApi";

const { Text } = Typography;

type Props = {
  data: INewsType[];
  loading: boolean;
};
export const NewsTypeTable = ({ data, loading }: Props) => {
  const [nameValue, setNameValue] = useState<string>();

  const columns: ColumnsType<INewsType> = [
    {
      title: "Loại bài viết",
      dataIndex: "Name",
      render(value, r) {
        return (
          <Space direction="vertical">
            <Text>
              {value} {`(${r.NewsCount})`}
            </Text>
          </Space>
        );
      },
    },
    {
      key: "action",
      title: "Thao tác",
      render: (value, record) => {
        return (
          <Space>
            <BtnConfirm
              type="icon"
              title="Chỉnh sửa loại tin"
              description={
                <Input
                  defaultValue={record.Name}
                  value={nameValue}
                  onChange={(e) => setNameValue(e.target.value)}
                />
              }
              onOkClick={async () => {
                console.log(nameValue);
                if (nameValue) {
                  await newsTypeApi.update({ ...record, Name: nameValue });
                  mutate(newsTypeApi.mutateKey);
                }
                setNameValue(undefined);
              }}
              icon={<SquarePenIcon className="size-4 " />}
            />

            <BtnConfirm
              type="icon"
              icon={<Trash2Icon className="size-4 " />}
              onOkClick={async () => {
                await newsTypeApi.delete(record.Id ?? 0);
                mutate(newsTypeApi.mutateKey);
              }}
            />
          </Space>
        );
      },
    },
  ];

  return (
    <TableNoPaging loading={loading} data={data} cols={columns} bordered />
  );
};
