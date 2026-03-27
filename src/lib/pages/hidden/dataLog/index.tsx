"use client";
import { Card, Col, Form, Input, Row, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";

import { DateFilter, SearchInput } from "@/lib/components/shared/MyFormItem";
import TableBase from "@/lib/components/shared/TableBase";
import { baseFilter } from "@/lib/core/configs/appConst";
import { FormatDateTime } from "@/lib/core/utils/myFormat";
import type { ILogItem, ILogOpts } from "@/services/api/base/ILogitem";
import utilsApi from "@/services/api/utilsApi";

const { Text } = Typography;

const columns: ColumnsType<ILogItem> = [
  {
    title: "Thời giam",
    dataIndex: "@t",
    sorter: true,
    render: (value, record) => FormatDateTime(value),
  },
  {
    title: "Url",
    dataIndex: "Scheme",
    width: 200,
    render(value, record) {
      return <Text>{value}</Text>;
    },
  },
  {
    title: "Method",
    dataIndex: "RequestMethod",
    render(value, record) {
      return <Text>{value}</Text>;
    },
  },
  {
    title: "Body",
    dataIndex: "Body",
    render(value, record) {
      return <Input.TextArea value={value} />;
    },
  },
  {
    title: "Status",
    dataIndex: "StatusCode",
    render(value, record) {
      return <Text>{value}</Text>;
    },
  },
  {
    title: "Error",
    dataIndex: "Error",
    width: 300,
    render(value, record) {
      return <Text type="danger">{value}</Text>;
    },
  },
  {
    title: "User",
    dataIndex: "User",
    render(value, record) {
      return <Text>{value}</Text>;
    },
  },
];

const DataLogPage = () => {
  const [form] = Form.useForm<ILogOpts>();

  const [opts, setOpts] = useState<ILogOpts>(baseFilter);
  const [data, setData] = useState<ILogItem[]>([]);
  useEffect(() => {
    const fetch = async () => {
      const res = await utilsApi.getLogs(opts);
      setData(res.data);
    };
    fetch();
  }, [opts]);

  const onSubmit = (item: ILogOpts) => {
    console.log(item);

    setOpts(item);
  };

  return (
    <Card>
      <Form
        name="basic"
        onFinish={onSubmit}
        autoComplete="off"
        form={form}
        layout="vertical"
      >
        <Row gutter={12}>
          <Col>
            <Form.Item name="Method">
              <Input placeholder="Method" />
            </Form.Item>
          </Col>
          <Col>
            <DateFilter form={form} />
          </Col>
          <Col>
            <SearchInput
              form={form}
              placeholder="Tìm mã, tên"
              handleRefresh={() => {
                form.resetFields();
                setOpts(baseFilter);
              }}
            />
          </Col>
        </Row>
      </Form>
      <TableBase
        loading={false}
        total={data.length}
        searchOptions={opts}
        data={data}
        cols={columns}
        onPageIndexChange={() => {}}
      />
    </Card>
  );
};

export default DataLogPage;
