import { MoreOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Input, type InputRef, Modal, Typography } from "antd";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { mutate } from "swr";

import MyBreadcrumb from "@/lib/components/shared/MyBreadcrumb";
import TableBase from "@/lib/components/shared/TableBase";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import { objToQueryString } from "@/lib/core/utils/app-func";
import type { INewsOpts } from "@/lib/interfaces/filter/ISearchOptions";
import newsApi from "@/services/api/news/newsApi";
import newsTypeApi from "@/services/api/news/newsTypeApi";
import { NewsTypeTable } from "../../newsType/table";
import NewsFilter from "../filter";
import columns from "../table/columns";

const NewsTypeTabs = ({
  opts,
  onSubmit,
}: {
  opts: INewsOpts;
  onSubmit: (values: INewsOpts) => void;
}) => {
  const selectedTags = opts.NewsTypeIds?.split(",").filter(Boolean) ?? [];
  const [newTag, setNewTag] = useState<string>();
  const [inputVisible, setInputVisible] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const [openModal, setOpenModal] = useState(false);

  const { data } = newsTypeApi.useGet({ pageIndex: 1, pageSize: 50 });
  const tagsData = data?.data ?? [];

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  const handleSelectAll = () => {
    onSubmit({
      ...opts,
      NewsTypeIds: "",
      pageIndex: 1,
    });
  };

  const handleChange = (tagId: string) => {
    const isSelected = selectedTags.includes(tagId);
    const nextSelectedTags = isSelected
      ? selectedTags.filter((t) => t !== tagId)
      : [...selectedTags, tagId];

    onSubmit({
      ...opts,
      NewsTypeIds: nextSelectedTags.join(","),
      pageIndex: 1,
    });
  };

  const handleInputConfirm = async () => {
    if (newTag?.trim()) {
      await newsTypeApi.add({ Name: newTag.trim() });
      mutate(newsTypeApi.mutateKey);
    }
    setInputVisible(false);
    setNewTag("");
  };

  return (
    <div className="news-type-tabs-bar">
      <div className="news-type-tabs-list">
        <button
          type="button"
          className={`news-type-tab ${selectedTags.length === 0 ? "active" : ""}`}
          onClick={handleSelectAll}
        >
          Tất cả
        </button>
        {tagsData.map((item) => {
          const tagId = item.Id?.toString() ?? "";
          return (
            <button
              key={item.Id}
              type="button"
              className={`news-type-tab ${
                selectedTags.includes(tagId) ? "active" : ""
              }`}
              onClick={() => handleChange(tagId)}
            >
              {item.Name}
            </button>
          );
        })}
      </div>

      <div className="news-type-tabs-actions">
        {inputVisible ? (
          <Input
            ref={inputRef}
            className="news-add-type-input"
            type="text"
            size="small"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onBlur={handleInputConfirm}
            onPressEnter={handleInputConfirm}
          />
        ) : (
          <Button
            className="news-add-type-btn"
            icon={<PlusOutlined />}
            onClick={() => setInputVisible(true)}
          >
            Thêm
          </Button>
        )}
        <Button
          className="news-more-btn"
          icon={<MoreOutlined />}
          onClick={() => setOpenModal(true)}
        />
      </div>

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
    </div>
  );
};

const NewsList = () => {
  const router = useRouter();
  const pathname = usePathname();
  const query = useSearchParams();
  const opts = {
    ...Object.fromEntries(query?.entries() ?? []),
  } as unknown as INewsOpts;

  const handleFilter = (values: INewsOpts) => {
    router.push(`${pathname}?${objToQueryString({ ...values, pageIndex: 1 })}`);
  };

  const handlePageIndexChange = (pageIndex: number, pageSize: number) => {
    router.push(
      `${pathname}?${objToQueryString({ ...opts, pageIndex, pageSize })}`
    );
  };

  const { data, isLoading, isValidating } = newsApi.useGet(opts);

  useEffect(() => {
    mutate(newsApi.mutateKey);
  }, [query]);

  return (
    <div className="news-listing">
      <MyBreadcrumb
        items={[{ url: AppRoutes.config.url, name: "Quản lý nội dung" }]}
        current={AppRoutes.news.name}
      />

      <Typography.Title level={3} className="news-page-title">
        {AppRoutes.news.name}
      </Typography.Title>

      <div className="news-filter-row">
        <NewsFilter model={opts} onSubmit={handleFilter} />
        <Button
          type="primary"
          className="news-create-btn"
          onClick={() => router.push(`${AppRoutes.news.url}/add`)}
        >
          + Tạo bài viết mới
        </Button>
      </div>

      <NewsTypeTabs opts={opts} onSubmit={handleFilter} />

      <div className="news-table">
        <TableBase
          loading={isLoading || isValidating}
          total={data?.totalRow ?? 0}
          searchOptions={opts}
          data={data?.data ?? []}
          cols={columns}
          onPageIndexChange={handlePageIndexChange}
        />
      </div>
    </div>
  );
};

export default NewsList;
