"use client";
import { Card, Space, Switch, Typography } from "antd";
import { useEffect, useState } from "react";

import NewsForm from "@/lib/components/admin/news/form";
import TitlePage from "@/lib/core/layout/components/TitlePage";
import type { INewsResponse } from "@/services/api/news/INews";
import newsApi from "@/services/api/news/newsApi";

type Props = {
  id: number;
};

const EditNewsPage = ({ id }: Props) => {
  const [data, setData] = useState<INewsResponse>();
  useEffect(() => {
    const fetch = async () => {
      if (id) {
        const res = await newsApi.getById(Number(id));
        setData(res.data);
      }
    };
    fetch();
  }, [id]);

  return (
    <Card
      title={<TitlePage title="Chỉnh sửa bài viết" />}
      extra={
        data && (
          <Space>
            <Switch
              checked={data.StatusName !== "Ẩn"}
              onChange={async () => {
                await newsApi.updateStatus(
                  data.Id ?? 0,
                  data.StatusName === "Ẩn" ? "Show" : "Hidden"
                );

                const res = await newsApi.getById(data.Id ?? 0);
                setData(res.data);
              }}
            />
            <Typography.Text>
              {data.StatusName === "Ẩn" ? "Ẩn bài" : "Đang hiển thị"}
            </Typography.Text>
          </Space>
        )
      }
    >
      <NewsForm model={data} />
    </Card>
  );
};

export default EditNewsPage;
