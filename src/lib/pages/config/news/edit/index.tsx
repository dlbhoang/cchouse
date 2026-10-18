"use client";
import { Alert, Button, Card, Space, Typography } from "antd";
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

  const isHidden = Boolean(
    data?.StatusName?.toLowerCase().includes("ẩn") ||
      data?.StatusName?.toLowerCase().includes("hidden")
  );
  const isApproved = Boolean(
    [0, 1, 4].includes(data?.Status ?? -1) ||
      data?.StatusName?.toLocaleLowerCase() === "đang hiển thị" ||
      data?.StatusName?.toLocaleLowerCase() === "đã duyệt" ||
      data?.ApprovedDate ||
      data?.ApprovedBy
  );

  if (!data) {
    return <Card loading title={<TitlePage title="Chỉnh sửa bài viết" />} />;
  }

  if (isApproved) {
    return (
      <Card title={<TitlePage title="Chỉnh sửa bài viết" />}>
        <Space direction="vertical" size="middle">
          <Alert
            type="info"
            showIcon
            message="Tin đã duyệt không thể chỉnh sửa. Hãy ẩn hoặc xóa tin rồi tạo tin mới."
          />
          <Button href="/admin/config/news">Quay lại danh sách tin</Button>
        </Space>
      </Card>
    );
  }

  return (
    <Card
      title={<TitlePage title="Chỉnh sửa bài viết" />}
      extra={
        data && (
          <Space>
            <Typography.Text>{isHidden ? "Đã ẩn" : data.StatusName}</Typography.Text>
          </Space>
        )
      }
    >
      <NewsForm model={data} />
    </Card>
  );
};

export default EditNewsPage;
