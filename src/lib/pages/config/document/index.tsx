"use client";
import {
  CaretRightOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Collapse,
  Input,
  Modal,
  Row,
  Space,
  Spin,
  Tabs,
  Typography,
} from "antd";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { mutate } from "swr";

import BtnConfirm from "@/lib/components/shared/BtnConfirm";
import FloatBtn from "@/lib/components/shared/FloatBtn";
import { baseFilter } from "@/lib/core/configs/appConst";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import TitlePage from "@/lib/core/layout/components/TitlePage";
import { FormatDate } from "@/lib/core/utils/myFormat";
import type { ISearchOptions } from "@/lib/interfaces/filter/ISearchOptions";
import { useAdminContext } from "@/lib/stored";
import documentApi from "@/services/api/document/documentApi";
import documentTypeApi from "@/services/api/document/documentTypeApi";
import type { IDocumentResponse } from "@/services/api/document/IDocument";

import AddEditDocument from "./addEdit";

const { Search } = Input;

const NewType = () => {
  const [newType, setNewType] = useState<string>();
  return (
    <Space.Compact style={{ padding: 10 }}>
      <Input
        value={newType}
        onChange={(e) => setNewType(e.target.value)}
        placeholder="Tên loại mới"
      />
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={async () => {
          if (newType) {
            await documentTypeApi.add({
              Name: newType,
            });
            mutate(documentTypeApi.mutateKey);
            setNewType(undefined);
          }
        }}
      />
    </Space.Compact>
  );
};

const DocumentPage = () => {
  const { data: session } = useSession();
  const { smallScreen } = useAdminContext();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selected, setSelected] = useState<IDocumentResponse>();
  const [searchOptions, setSearchOptions] = useState<ISearchOptions>({
    pageIndex: 1,
    pageSize: 1000,
  });

  const { data: types, isLoading } = documentTypeApi.useGet(baseFilter);
  const { data: docs, mutate: mutateDocs } = documentApi.useGet(searchOptions);

  const onEdit = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: "add" | "remove"
  ) => {
    if (action === "remove") {
      Modal.confirm({
        title: "Bạn đang xoá danh mục?",
        onOk: async () => {
          await documentTypeApi.delete(Number(targetKey));
          mutate(documentTypeApi.mutateKey);
        },
      });
    }
  };

  const genExtra = (f: IDocumentResponse) => (
    <Space size="middle">
      {f.PdfFile && (
        <Typography.Link href={f.PdfFile.toString()} target="_blank" download>
          Tải file PDF
        </Typography.Link>
      )}
      {f.DocFile && (
        <Typography.Link href={f.DocFile.toString()} target="_blank" download>
          Tải file Word
        </Typography.Link>
      )}
      {[1, 2].includes(session?.user?.RoleId ?? 0) && (
        <>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setSelected(f);
              setOpenModal(true);
            }}
          />
          <BtnConfirm
            size="small"
            icon={<DeleteOutlined />}
            onOkClick={async () => {
              if (f.Id) {
                await documentApi.delete(f.Id);
                mutate(documentApi.mutateKey);
              }
            }}
            type="icon"
            danger
          />
        </>
      )}
    </Space>
  );

  const items = types?.data.map((e) => ({
    label: `${e.Name} (${
      docs?.data.filter((s) => s.DocumentTypeId === e.Id)?.length ?? 0
    })`,
    key: e.Id?.toString() ?? "",
    closable: [1, 2].includes(session?.user?.RoleId ?? 0),
    children: (
      <Collapse
        // eslint-disable-next-line react/no-unstable-nested-components
        expandIcon={({ isActive }) => (
          <CaretRightOutlined rotate={isActive ? 90 : 0} />
        )}
        items={docs?.data
          .filter((s) => s.DocumentTypeId === e.Id)
          .map((f) => ({
            key: f.Id?.toString(),
            label: (
              <Space direction="vertical" size="small">
                <span>{f.Name}</span>
                <Space size="large">
                  <Typography.Text type="secondary">
                    Ngày tạo: {FormatDate(f.CreatedDate)}
                  </Typography.Text>
                  <Typography.Text type="secondary">
                    Cập nhật: {FormatDate(f.UpdatedDate ?? f.CreatedDate)}
                  </Typography.Text>
                </Space>
              </Space>
            ),
            children: f.Note ?? "Không có thông tin mô tả",
            extra: genExtra(f),
          }))}
      />
    ),
  }));
  useEffect(() => {
    if (docs !== undefined) {
      mutateDocs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchOptions]);
  return (
    <Card
      title={
        <Row justify="space-between" align="middle">
          <Col>
            <TitlePage title={AppRoutes.document.name} />
          </Col>
          <Col>
            <Search
              placeholder="Tìm tên văn bản"
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
      {isLoading ? (
        <Spin />
      ) : (
        <Tabs
          // size="large"
          tabBarStyle={{ minWidth: 100 }}
          tabBarExtraContent={
            [1, 2].includes(session?.user?.RoleId ?? 0)
              ? {
                  right: smallScreen ? undefined : <NewType />,
                }
              : undefined
          }
          hideAdd
          type="editable-card"
          items={items}
          onEdit={onEdit}
        />
      )}
      <AddEditDocument
        isOpen={openModal}
        onOpenChange={(val) => {
          setOpenModal(val);
          setSelected(undefined);
        }}
        types={types?.data ?? []}
        model={selected}
      />
      <FloatBtn onClick={() => setOpenModal(true)} />
    </Card>
  );
};

export default DocumentPage;
