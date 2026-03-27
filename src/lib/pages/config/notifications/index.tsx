"use client";
import { CaretRightOutlined, SendOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Collapse,
  Input,
  Row,
  Space,
  Spin,
  Typography,
} from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";

import FloatBtn from "@/lib/components/shared/FloatBtn";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import TitlePage from "@/lib/core/layout/components/TitlePage";
import { FormatDateTime } from "@/lib/core/utils/myFormat";
import type {
  INotiOpts,
  INotiResponse,
} from "@/services/api/notifications/INoti";
import notiApi from "@/services/api/notifications/notiApi";

import AddNoti from "./addEdit";

const { Search } = Input;

const NotiPage = () => {
  const [editModel, setEditModel] = useState<INotiResponse>();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [searchOptions, setSearchOptions] = useState<INotiOpts>({
    OriginNoti: true,
    pageIndex: 1,
    pageSize: 20,
  });

  const { data, isLoading, mutate } = notiApi.useGet(searchOptions);

  const genExtra = (f: INotiResponse) => (
    <Space size="middle">
      <Button
        icon={<SendOutlined />}
        onClick={() => {
          setEditModel(f);
          setOpenModal(true);
        }}
      >
        Gửi lại
      </Button>
    </Space>
  );

  const items = (
    <Collapse
      // eslint-disable-next-line react/no-unstable-nested-components
      expandIcon={({ isActive }) => (
        <CaretRightOutlined rotate={isActive ? 90 : 0} />
      )}
      items={data?.data.map((f) => ({
        key: f.Id?.toString(),
        label: (
          <Space direction="vertical" size="small">
            <span>{f.Title}</span>
            <Typography.Text type="secondary">
              Ngày tạo: {FormatDateTime(f.CreatedDate)}
            </Typography.Text>
          </Space>
        ),
        children: (
          <Row>
            <Col span={24} style={{ whiteSpace: "pre-wrap" }}>
              {f.Description ?? "Không có thông tin mô tả"}
            </Col>
            {f.AttachFiles && (
              <Col span={24}>
                <Space direction="vertical" size="small">
                  {f.AttachFiles.map((e, idx) => (
                    <Link href={e} target="_blank">
                      {`${idx + 1}. Tệp đính kèm`}
                    </Link>
                  ))}
                </Space>
              </Col>
            )}
          </Row>
        ),
        extra: genExtra(f),
      }))}
    />
  );
  useEffect(() => {
    if (data !== undefined) {
      mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchOptions]);

  const body = isLoading ? <Spin /> : items;

  return (
    <Card
      title={
        <Row justify="space-between" align="middle">
          <Col>
            <TitlePage title={AppRoutes.notifications.name} />
          </Col>
          <Col>
            <Search
              placeholder="Tìm theo tiêu đề"
              allowClear
              onSearch={(val: string) => {
                setSearchOptions({
                  ...searchOptions,
                  search: val,
                  pageIndex: 1,
                });
              }}
              style={{ width: 250 }}
            />
          </Col>
        </Row>
      }
    >
      {(data?.totalRow ?? 0) > 0 ? body : <span>Không có dữ liệu</span>}
      <AddNoti
        isOpen={openModal}
        onOpenChange={(val) => {
          setOpenModal(val);
          setEditModel(undefined);
        }}
        model={editModel}
      />
      <FloatBtn onClick={() => setOpenModal(true)} />
    </Card>
  );
};

export default NotiPage;
