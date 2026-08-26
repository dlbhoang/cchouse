import { Button, InputRef, Modal, Typography } from "antd";
import { MoreVertical, Plus } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { mutate } from "swr";

import MyBreadcrumb from "@/lib/components/shared/MyBreadcrumb";
import TableBase from "@/lib/components/shared/TableBase";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import { objToQueryString } from "@/lib/core/utils/app-func";
import type { INewsOpts } from "@/lib/interfaces/filter/ISearchOptions";
import type { INewsResponse } from "@/services/api/news/INews";
import newsApi from "@/services/api/news/newsApi";
import newsTypeApi from "@/services/api/news/newsTypeApi";
import NewsForm from "@/lib/components/admin/news/form";
import NewPreview from "../preview";
import { NewsTypeTable } from "../../newsType/table";
import AddEditModal from "../../newsType/modal";
import NewsFilter from "../filter";
import { useNewsColumns } from "../table/columns";

const NewsTypeTabs = ({
  opts,
  onSubmit,
}: {
  opts: INewsOpts;
  onSubmit: (values: INewsOpts) => void;
}) => {
  const selectedTags =
    Array.isArray(opts.NewsTypeIds)
      ? opts.NewsTypeIds.map((id) => String(id))
      : typeof opts.NewsTypeIds === "string"
        ? opts.NewsTypeIds.split(",").filter(Boolean)
        : [];
  const [newTag, setNewTag] = useState<string>();
  const [inputVisible, setInputVisible] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const [openModal, setOpenModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);

  const { data } = newsTypeApi.useGet({ pageIndex: 1, pageSize: 50 });
  const tagsData = data?.data ?? [];

  const [counts, setCounts] = useState<Record<string, number>>({});

  // Tổng số tin của "Tất cả" — ưu tiên dùng counts thu thập được, fallback về NewsCount
  const allCount = Object.keys(counts).length
    ? Object.values(counts).reduce((s, v) => s + v, 0)
    : tagsData.reduce((sum, item) => sum + (item.NewsCount ?? 0), 0);

  const enrichedTypes = tagsData.map((item) => ({
    ...item,
    NewsCount: counts[item.Id?.toString() ?? ""] ?? item.NewsCount,
  }));

  useEffect(() => {
    if (!tagsData || tagsData.length === 0) return;

    let mounted = true;

    (async () => {
      try {
        const results = await Promise.all(
          tagsData.map(async (item) => {
            const id = item.Id ?? 0;
            const res = await newsApi.get({ pageIndex: 1, pageSize: 1, NewsTypeIds: id });
            const total = ((res as any)?.totalRow ?? (res as any)?.data?.totalRow) ?? 0;
            return { id, total };
          })
        );

        if (!mounted) return;

        const map: Record<string, number> = {};
        results.forEach((r) => {
          map[String(r.id)] = r.total ?? 0;
        });
        setCounts(map);
      } catch (e) {
        // ignore errors; leave counts empty so fallback values used
      }
    })();

    return () => {
      mounted = false;
    };
  }, [tagsData]);

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
      ? selectedTags.filter((tag) => tag !== tagId)
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
          Tất cả ({allCount})
        </button>
        {tagsData.map((item) => {
          const tagId = item.Id?.toString() ?? "";
          const count = counts[tagId] ?? item.NewsCount ?? 0;
          return (
            <button
              key={item.Id}
              type="button"
              className={`news-type-tab ${
                selectedTags.includes(tagId) ? "active" : ""
              }`}
              onClick={() => handleChange(tagId)}
            >
              {item.Name} ({count})
            </button>
          );
        })}
      </div>

      <div className="news-type-tabs-actions">
        <Button
          className="news-add-type-btn"
          icon={<Plus size={14} />}
          onClick={() => setOpenAddModal(true)}
        >
          Thêm
        </Button>
        <Button
          className="news-more-btn"
          icon={<MoreVertical size={16} />}
          onClick={() => setOpenModal(true)}
        />
      </div>

      <Modal
        title={null}
        className="news-type-modal"
        wrapClassName="news-type-modal-wrap"
        open={openModal}
        onCancel={() => setOpenModal(false)}
        footer={null}
        closable={false}
        width={520}
      >
        <div className="news-type-modal-wrapper">
          <div className="news-type-modal-header">
            <div>
              <div className="news-type-modal-title">Loại tin tức</div>
              <div className="news-type-modal-count">
                Tìm được <Typography.Text strong>{data?.data?.length ?? 0}</Typography.Text> kết quả
              </div>
            </div>
            <button
              type="button"
              className="news-type-modal-close"
              onClick={() => setOpenModal(false)}
              aria-label="Đóng"
            >
              ×
            </button>
          </div>

          <div className="news-type-modal-body">
            <NewsTypeTable loading={false} data={enrichedTypes} counts={counts} />
          </div>

          <div className="news-type-modal-footer">
            <button
              type="button"
              className="news-type-modal-cancel-btn"
              onClick={() => setOpenModal(false)}
            >
              Hủy
            </button>
          </div>
        </div>
      </Modal>

      <AddEditModal
        isModalOpen={openAddModal}
        handleCancel={() => setOpenAddModal(false)}
      />

    </div>
  );
};

const NewsList = () => {
  const router = useRouter();
  const pathname = usePathname();
  const query = useSearchParams();
  const [isNewsFormModalOpen, setIsNewsFormModalOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<INewsResponse | undefined>();

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

  const hasLocalFilters = Boolean(opts.SourceType || opts.fromDate || opts.toDate);
  const requestOpts = hasLocalFilters
    ? {
        ...opts,
        pageIndex: 1,
        pageSize: 10000,
        SourceType: undefined,
        fromDate: undefined,
        toDate: undefined,
      }
    : opts;
  const { data, isLoading, isValidating } = newsApi.useGet(requestOpts);
  const filteredNewsItems = (data?.data ?? []).filter((item) => {
    const sourceType = opts.SourceType;
    if (sourceType === "share" && !item.Source?.trim()) return false;
    if (sourceType === "write" && item.Source?.trim()) return false;

    const itemDate = new Date(item.CreatedDate);
    if (opts.fromDate && itemDate < new Date(`${opts.fromDate}T00:00:00`)) return false;
    if (opts.toDate && itemDate > new Date(`${opts.toDate}T23:59:59.999`)) return false;
    return true;
  });
  const pageIndex = Number(opts.pageIndex ?? 1);
  const pageSize = Number(opts.pageSize ?? 30);
  const newsItems = hasLocalFilters
    ? filteredNewsItems.slice((pageIndex - 1) * pageSize, pageIndex * pageSize)
    : filteredNewsItems;
  const [previewNews, setPreviewNews] = useState<INewsResponse | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    mutate(newsApi.mutateKey);
  }, [query]);

  const handleOpenNewNewsForm = () => {
    setSelectedNews(undefined);
    setIsNewsFormModalOpen(true);
  };

  const handleOpenEditNewsForm = async (item: INewsResponse) => {
    try {
      if (item.Content && item.Content.trim().length > 0) {
        setSelectedNews(item);
        setIsNewsFormModalOpen(true);
        return;
      }

      const res = await newsApi.getById(item.Id ?? 0);
      setSelectedNews(res.data);
      setIsNewsFormModalOpen(true);
    } catch (error) {
      console.error("Failed to load full news item:", error);
      setSelectedNews(item);
      setIsNewsFormModalOpen(true);
    }
  };

  const handleCloseNewsFormModal = () => {
    setIsNewsFormModalOpen(false);
    setSelectedNews(undefined);
  };

  const handleRejectNews = async (item: INewsResponse) => {
    await newsApi.updateStatus(item.Id ?? 0, "Hidden");
    mutate(newsApi.mutateKey);
    handleCloseNewsFormModal();
  };

  const handleOpenPreview = async (item: INewsResponse) => {
    if (!item.Id) return;

    if (item.Content) {
      setPreviewNews(item);
      setPreviewOpen(true);
      return;
    }

    try {
      const res = await newsApi.getById(item.Id);
      setPreviewNews(res.data);
      setPreviewOpen(true);
    } catch (error) {
      console.error("Failed to load news preview", error);
    }
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
    setPreviewNews(null);
  };

  const createNewsButton = (
  <button
    type="button"
    onClick={handleOpenNewNewsForm}
    className="news-filter-create-btn"
  >
    <Plus size={16} />
    <span>Viết bài</span>
  </button>
);
  return (
    <div className="news-listing">
      <MyBreadcrumb
        items={[{ url: AppRoutes.config.url, name: "Quản lý nội dung" }]}
        current={AppRoutes.news.name}
      />

      <Typography.Title
        level={4}
        style={{
          margin: "16px 0 12px",
          color: "var(--Text-Main, #0A0A0A)",
          fontFamily: "var(--Font-family-Text, Inter)",
          fontSize: "var(--Font-sizes-text-2xl, 24px)",
          fontStyle: "normal",
          fontWeight: 700,
          textTransform: "uppercase",
          lineHeight: "var(--Line-height-text-2xl, 32px)",
        }}
      >
        {AppRoutes.news.name}
      </Typography.Title>

      {/* Filter + nút Viết bài cùng một hàng */}
      <NewsFilter model={opts} onSubmit={handleFilter} extra={createNewsButton} />

      {/* News Type Tabs */}
      <NewsTypeTabs opts={opts} onSubmit={handleFilter} />


      {/* News Table */}
      <div className="news-table">
        <TableBase
          loading={isLoading || isValidating}
          total={hasLocalFilters ? filteredNewsItems.length : data?.totalRow ?? 0}
          searchOptions={opts}
          data={newsItems}
          cols={useNewsColumns(handleOpenPreview, handleOpenEditNewsForm)}
          onPageIndexChange={handlePageIndexChange}
        />
      </div>

      {previewNews && (
        <NewPreview
          model={previewNews}
          isModalOpen={previewOpen}
          handleCancel={handleClosePreview}
          onEdit={handleOpenEditNewsForm}
        />
      )}

      {/* News Form Modal */}
      <Modal
        title={null}
        open={isNewsFormModalOpen}
        onCancel={handleCloseNewsFormModal}
        footer={null}
        width={1152}
        style={{ top: 20 }}
        wrapClassName="news-form-modal-wrap"
        styles={{
          body: {
            padding: 0,
            height: "100%",
            maxHeight: "100%",
            overflow: "hidden",
          },
        }}
        className="news-form-modal"
        centered={false}
        closeIcon={null}
      >
        <NewsForm
          model={selectedNews}
          onClose={handleCloseNewsFormModal}
          hideHeader={false}
          onReject={handleRejectNews}
        />
      </Modal>

    </div>
  );
};

export default NewsList;