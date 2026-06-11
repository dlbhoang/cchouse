"use client";
import { Avatar, Card, Col, Divider, Row, Space, Typography } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import { mutate } from "swr";

import HistoryTree from "@/lib/components/shared/HistoryTree";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import { FormatDateTime } from "@/lib/core/utils/myFormat";
import { useAdminContext } from "@/lib/stored";
import type { INotiResponse } from "@/services/api/notifications/INoti";
import notiApi from "@/services/api/notifications/notiApi";
import userAdminApi from "@/services/api/userAdmin/userAdminApi";

const { Meta } = Card;

type Props = {
  id: number;
};

const NotiDetailPage = ({ id }: Props) => {
  const { smallScreen } = useAdminContext();
  const [data, setData] = useState<INotiResponse>();

  useEffect(() => {
    const fetch = async () => {
      if (id) {
        const res = await notiApi.getById(Number(id));
        if (res.data) {
          setData(res.data);
          mutate(userAdminApi.countUnReadKey);
        }
      }
    };
    fetch();
  }, [id]);

  return (
    <Row justify="center">
      <Col span={smallScreen ? 24 : 12}>
        <Card style={smallScreen ? { height: "80vh" } : undefined}>
          <Row gutter={[12, 7]}>
            <Col span={24}>
              <Meta
                avatar={<Avatar src={data?.CreatedAvatar} size="large" />}
                title={data?.Title}
                description={FormatDateTime(data?.CreatedDate)}
              />
            </Col>
            <Divider />
            <Col span={24} style={{ whiteSpace: "pre-wrap" }}>
              {data?.Description}
            </Col>
            <Col span={24}>
              {data?.AttachFiles && (
                <Space direction="vertical" size="small">
                  {data?.AttachFiles.map((e, idx) => (
                    <Link key={e} href={e} target="_blank">
                      {`${idx + 1}. Tệp đính kèm`}
                    </Link>
                  ))}
                </Space>
              )}
            </Col>
            {data?.ReferenceTypeName === "Property" && (
              <Col span={24}>
                <Link
                  href={`${AppRoutes.property.url}?Status=1,2,3,7&PropertyId=${data.ReferenceId}`}
                >
                  Xem chi tiết bất động sản
                </Link>
              </Col>
            )}
            {data?.ReferenceId && data.ReferenceTypeName === "Property" && (
              <Col span={24}>
                <Typography.Text strong>Lịch sử thay đổi</Typography.Text>
                <HistoryTree
                  instanceId={Number(data.ReferenceId)}
                  TableName="tblProp"
                  oldTableName="tblProperty"
                />
              </Col>
            )}
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default NotiDetailPage;
