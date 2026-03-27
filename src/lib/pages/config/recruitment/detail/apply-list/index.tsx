"use client";
import { SearchOutlined } from "@ant-design/icons";
import { Badge, Input, List, Skeleton } from "antd";
import { useEffect, useState } from "react";
import { useAdminContext } from "@/lib/stored";
import type { ICandidate } from "@/services/api/recruitment/IRecruitment";
import recruitmentApi from "@/services/api/recruitment/recruitmentApi";
import { FormatDate } from "../../../../../core/utils/myFormat";

const ApplyList = ({ id }: { id: number }) => {
  const { smallScreen } = useAdminContext();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [data, setData] = useState<ICandidate[]>([]);
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const res = await recruitmentApi.getCandidates(id);
      setData(res.data);
      setLoading(false);
    };
    fetch();
  }, [id]);

  return (
    <List
      loading={loading}
      header={
        <Input
          placeholder="Tìm kiếm theo tên, sdt"
          suffix={<SearchOutlined />}
          style={{ width: 200 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
        />
      }
      itemLayout={smallScreen ? "vertical" : "horizontal"}
      dataSource={data.filter(
        (x) => x.FullName.includes(search) || x.Phone.startsWith(search)
      )}
      renderItem={(item) => (
        <List.Item
          actions={[
            <a href={`tel:${item.Phone}`}>{item.Phone}</a>,
            <a
              href={item.CVFile}
              download={item.FullName}
              onClick={async () => {
                await recruitmentApi.markAsReadCandidate(id, item.Id);

                setLoading(true);
                const res = await recruitmentApi.getCandidates(id);
                setData(res.data);
                setLoading(false);
              }}
            >
              File CV
            </a>,
          ]}
          extra={item.IsRead ? undefined : <Badge count="Mới" />}
        >
          <Skeleton title={false} loading={loading} active>
            <List.Item.Meta title={item.FullName} description={item.Email} />
            <div>{`Ngày nộp: ${FormatDate(item.ApplyDate)}`}</div>
          </Skeleton>
        </List.Item>
      )}
    />
  );
};

export default ApplyList;
