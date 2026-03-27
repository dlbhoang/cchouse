import { MoreOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Empty,
  Input,
  type InputRef,
  Modal,
  Row,
  Space,
  Tag,
  Typography,
} from "antd";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { mutate } from "swr";

import AppPagination from "@/lib/components/shared/pagination";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import { objToQueryString } from "@/lib/core/utils/app-func";
import type { INewsOpts } from "@/lib/interfaces/filter/ISearchOptions";
import type { INewsResponse } from "@/services/api/news/INews";
import newsApi from "@/services/api/news/newsApi";
import newsTypeApi from "@/services/api/news/newsTypeApi";
import { NewsTypeTable } from "../../newsType/table";
import NewsFilter from "../filter";
import NewItem from "../newItem";
import NewPreview from "../preview";

const NewsTypeTags = ({
  opts,
  onSubmit,
}: {
  opts: INewsOpts;
  onSubmit: (values: INewsOpts) => void;
}) => {
  const selectedTags = opts.NewsTypeIds?.split(",") ?? [];
  const [newTag, setNewTag] = useState<string>();
  const [inputVisible, setInputVisible] = useState(false);
  const inputRef = useRef<InputRef>(null);

  const [openModal, setOpenModal] = useState(false);

  const { data } = newsTypeApi.useGet({ pageIndex: 1, pageSize: 50 });

  const handleChange = (tag: string, checked: boolean) => {
    const nextSelectedTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter((t) => t !== tag);

    onSubmit({
      ...opts,
      NewsTypeIds: nextSelectedTags.filter((x) => x !== "").join(","),
    });
  };
  const tagsData = data?.data.map((e) => e) ?? [];

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTag(e.target.value);
  };

  const handleInputConfirm = async () => {
    if (newTag && newTag !== "") {
      await newsTypeApi.add({ Name: newTag });
      mutate(newsTypeApi.mutateKey);
    }
    setInputVisible(false);
    setNewTag("");
  };

  return (
    <Space>
      {tagsData.map((e) => (
        <Tag.CheckableTag
          key={e.Id}
          checked={selectedTags.includes(e.Id?.toString() ?? "")}
          onChange={(checked) => handleChange(e.Id?.toString() ?? "", checked)}
          style={{ borderStyle: "dashed", fontSize: 14 }}
        >
          {e.Name}
        </Tag.CheckableTag>
      ))}
      {inputVisible ? (
        <Input
          ref={inputRef}
          style={{ width: 70 }}
          type="text"
          size="small"
          value={newTag}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      ) : (
        <Tag
          onClick={() => {
            setInputVisible(true);
          }}
        >
          + Thêm
        </Tag>
      )}

      <Button
        icon={<MoreOutlined />}
        size="small"
        type="dashed"
        shape="circle"
        onClick={() => setOpenModal(true)}
      />

      <Modal
        title="LOẠI TIN TỨC"
        style={{ top: 20 }}
        open={openModal}
        onCancel={() => setOpenModal(false)}
        footer={null}
      >
        <span>
          TÌM ĐƯỢC{" "}
          <Typography.Text strong>{data?.data?.length ?? 0}</Typography.Text>{" "}
          KẾT QUẢ
        </span>

        <NewsTypeTable loading={false} data={data?.data ?? []} />
      </Modal>
    </Space>
  );
};

const NewsList = () => {
  const router = useRouter();
  const pathname = usePathname();
  const query = useSearchParams();
  const opts = {
    ...Object.fromEntries(query?.entries() ?? []),
  } as any as INewsOpts;

  const [preview, setPreview] = useState<INewsResponse>();
  const [openPreview, setOpenPreview] = useState(false);

  const handleFilter = (values: INewsOpts) => {
    console.log("filter ", values);
    router.push(`${pathname}?${objToQueryString(values)}`);
  };

  const { data } = newsApi.useGet(opts);

  useEffect(() => {
    mutate(newsApi.mutateKey);
  }, [query]);
  return (
    <Row gutter={[12, 12]}>
      <Col span={24}>
        <Card>
          <Space direction="vertical">
            <NewsFilter onSubmit={handleFilter} />
            <NewsTypeTags opts={opts} onSubmit={handleFilter} />
            <Typography.Text>
              Tìm được{" "}
              <Typography.Text strong>{data?.totalRow ?? 0}</Typography.Text>{" "}
              kết quả
            </Typography.Text>
          </Space>
        </Card>
      </Col>
      <Col span={24}></Col>
      {data?.totalRow === 0 ? (
        <Col span={24}>
          <Empty
            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
            imageStyle={{ height: 60 }}
            description={<span>Không tìm thấy dữ liệu</span>}
          >
            <Button
              type="primary"
              onClick={() => router.push(`${AppRoutes.news.url}/add`)}
            >
              + Tạo tin mới
            </Button>
          </Empty>
        </Col>
      ) : (
        data?.data.map((e) => (
          <Col xs={24} md={12} lg={12} xl={6} key={e.Id}>
            <NewItem
              item={e}
              onPreview={async (item) => {
                const res = await newsApi.getById(item.Id ?? 0);
                if (res.data) {
                  setPreview(res.data);
                  setOpenPreview(true);
                }
              }}
            />
          </Col>
        ))
      )}
      {data?.totalRow !== 0 && (
        <Col span={24} style={{ textAlign: "center" }}>
          <AppPagination total={data?.totalRow ?? 0} />
          {preview && (
            <NewPreview
              model={preview}
              isModalOpen={openPreview}
              handleCancel={() => setOpenPreview(false)}
            />
          )}
        </Col>
      )}
    </Row>
  );
};

export default NewsList;
