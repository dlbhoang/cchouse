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
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      if (id) {
        const res = await newsApi.getById(Number(id));
        setData(res.data);
      }
    };
    fetch();
  }, [id]);

  const isHidden = Boolean(
    data?.StatusName?.toLowerCase().includes("ẩn") ||
      data?.StatusName?.toLowerCase().includes("hidden")
  );

  return (
    <Card
      title={<TitlePage title="Chỉnh sửa bài viết" />}
      extra={
        data && (
          <Space>
            <Switch
              checked={!isHidden}
              loading={updating}
              onChange={async () => {
                if (!data) return;
                setUpdating(true);
                try {
                  if (isHidden) {
                    await newsApi.show(data.Id ?? 0);
                  } else {
                    await newsApi.hidden(data.Id ?? 0);
                  }
                  const res = await newsApi.getById(data.Id ?? 0);
                  setData(res.data);
                } finally {
                  setUpdating(false);
                }
              }}
            />
            <Typography.Text>
              {isHidden ? "Ẩn bài" : "Đang hiển thị"}
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
