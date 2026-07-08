import { Button, Input, InputRef, Modal, Switch, Typography } from "antd";
import { MoreOutlined, PlusOutlined } from "@ant-design/icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { mutate } from "swr";

import MyBreadcrumb from "@/lib/components/shared/MyBreadcrumb";
import TableBase from "@/lib/components/shared/TableBase";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import { objToQueryString } from "@/lib/core/utils/app-func";
import type { INewsOpts } from "@/lib/interfaces/filter/ISearchOptions";
import type { INewsRequest, INewsResponse } from "@/services/api/news/INews";
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
          icon={<PlusOutlined />}
          onClick={() => setOpenAddModal(true)}
        >
          Thêm
        </Button>
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

      <AddEditModal
        isModalOpen={openAddModal}
        handleCancel={() => setOpenAddModal(false)}
      />

      <style jsx>{`
        .news-type-tabs-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 16px;
        }

        .news-type-tabs-list {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .news-type-tab {
          display: inline-flex;
          align-items: center;
          height: 32px;
          padding: 0 14px;
          border: none;
          border-radius: 16px;
          background-color: #f0f0f0;
          color: #1f1f1f;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
          outline: none;
          box-shadow: none;
          -webkit-tap-highlight-color: transparent;
          transition: background-color 0.15s ease, color 0.15s ease;
        }

        .news-type-tab:hover {
          background-color: #e6e6e6;
        }

        .news-type-tab:focus,
        .news-type-tab:focus-visible {
          outline: none;
          box-shadow: none;
        }

        .news-type-tab.active {
          background-color: #1a1a1a;
          color: #ffffff;
        }

        .news-type-tab.active:hover {
          background-color: #000000;
        }

        .news-type-tab.active::after {
          display: none;
        }

        .news-type-tabs-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-left: auto;
        }

        .news-add-type-input {
          height: 32px;
          width: 140px;
          border-radius: 16px;
        }
      `}</style>
      <style jsx global>{`
        .news-add-type-btn.ant-btn {
          height: 32px;
          border-radius: 16px;
          border: 1px solid #d9d9d9;
          background-color: #ffffff;
          color: #1f1f1f;
          font-size: 13px;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          box-shadow: none;
          outline: none;
        }

        .news-add-type-btn.ant-btn:hover,
        .news-add-type-btn.ant-btn:focus {
          border-color: #bfbfbf;
          color: #1f1f1f;
          box-shadow: none;
          outline: none;
        }

        .news-more-btn.ant-btn {
          height: 32px;
          width: 32px;
          min-width: 32px;
          border-radius: 8px;
          border: 1px solid #d9d9d9;
          background-color: #ffffff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          box-shadow: none;
          outline: none;
        }

        .news-action-menu-item {
          width: 100%;
          display: flex;
          align-items: center;
          padding: 10px 12px;
          border: none;
          background: transparent;
          color: #111827;
          text-align: left;
          cursor: pointer;
          font-size: 14px;
        }

        .news-action-menu-item:hover {
          background: #f4f5f7;
        }

        .news-more-btn.ant-btn:hover,
        .news-more-btn.ant-btn:focus {
          border-color: #bfbfbf;
          box-shadow: none;
          outline: none;
        }

        /* Tắt hiệu ứng "wave" (viền sóng xanh khi click) mặc định của antd cho 2 nút này */
        .news-add-type-btn .ant-wave,
        .news-more-btn .ant-wave {
          display: none !important;
        }
      `}</style>
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

  const { data, isLoading, isValidating } = newsApi.useGet(opts);
  const [previewNews, setPreviewNews] = useState<INewsResponse | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    mutate(newsApi.mutateKey);
  }, [query]);

  const handleOpenNewNewsForm = () => {
    setSelectedNews(undefined);
    setIsNewsFormModalOpen(true);
  };

  const handleOpenEditNewsForm = (item: INewsResponse) => {
    setSelectedNews(item);
    setIsNewsFormModalOpen(true);
  };

  const handleCloseNewsFormModal = () => {
    setIsNewsFormModalOpen(false);
    setSelectedNews(undefined);
  };

  const handleToggleNewsStatus = async (shouldShow?: boolean) => {
    if (!selectedNews) return;
    setIsUpdatingStatus(true);
    try {
      const isHidden = Boolean(
        selectedNews?.StatusName?.toLowerCase().includes("ẩn") ||
          selectedNews?.StatusName?.toLowerCase().includes("hidden")
      );
      // Use the shouldShow parameter if provided (from Switch), otherwise toggle
      const newStatus = shouldShow !== undefined ? (shouldShow ? "Show" : "Hidden") : (isHidden ? "Show" : "Hidden");
      await newsApi.updateStatus(
        selectedNews.Id ?? 0,
        newStatus
      );
      const res = await newsApi.getById(selectedNews.Id ?? 0);
      setSelectedNews(res.data);
      mutate(newsApi.mutateKey);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleOpenPreview = (item: INewsResponse) => {
    setPreviewNews(item);
    setPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
    setPreviewNews(null);
  };

  const createNewsButton = (
    <button
      type="button"
      onClick={handleOpenNewNewsForm}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        padding: "8px 16px",
        borderRadius: "10px",
        background: "#0588f0",
        color: "#fff",
        border: "none",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: 500,
        lineHeight: 1,
        whiteSpace: "nowrap",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        transition: "all 0.2s ease",
      }}
    >
      <PlusOutlined />
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
          lineHeight: "var(--Line-height-text-2xl, 32px)",
        }}
      >
        {AppRoutes.news.name}
      </Typography.Title>

      {/* Filter + nút Viết bài cùng một hàng */}
      <NewsFilter model={opts} onSubmit={handleFilter} extra={createNewsButton} />

      {/* News Type Tabs */}
      <NewsTypeTabs opts={opts} onSubmit={handleFilter} />

      {/* Results count */}
      <div className="news-result-count">
        Tìm được <span className="news-result-count-strong">{data?.totalRow ?? 0}</span> kết quả
      </div>

      {/* News Table */}
      <div className="news-table">
        <TableBase
          loading={isLoading || isValidating}
          total={data?.totalRow ?? 0}
          searchOptions={opts}
          data={data?.data ?? []}
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
        title={selectedNews ? (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            <span>Chỉnh sửa bài viết</span>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <Switch
                checked={selectedNews && !Boolean(
                  selectedNews?.StatusName?.toLowerCase().includes("ẩn") ||
                    selectedNews?.StatusName?.toLowerCase().includes("hidden")
                )}
                loading={isUpdatingStatus}
                onChange={handleToggleNewsStatus}
              />
              <Typography.Text>
                {selectedNews && Boolean(
                  selectedNews?.StatusName?.toLowerCase().includes("ẩn") ||
                    selectedNews?.StatusName?.toLowerCase().includes("hidden")
                ) ? "Ẩn bài" : "Đang hiển thị"}
              </Typography.Text>
            </div>
          </div>
        ) : null}
        open={isNewsFormModalOpen}
        onCancel={handleCloseNewsFormModal}
        footer={null}
        width={900}
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
        />
      </Modal>

      <style jsx>{`
        .news-listing {
          padding: 0;
        }

        .news-result-count {
          margin-bottom: 14px;
          padding-left: 0;
          font-size: 13px;
          color: #737373;
        }

        .news-result-count-strong {
          color: #171717;
          font-weight: 600;
        }

        .news-table {
          background: #ffffff;
          border-radius: 10px;
          box-shadow: 0 1px 2px rgba(16, 16, 16, 0.04);
          overflow: hidden;
        }

        .news-form-modal :global(.ant-modal-header) {
          display: none !important;
        }

        .news-form-modal :global(.ant-modal-close) {
          display: none !important;
        }

        .news-form-modal :global(.ant-modal-content) {
          border-radius: 8px;
          overflow: hidden;
          height: 90vh;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
        }

        .news-form-modal :global(.ant-modal-body) {
          padding: 0 !important;
          height: 100%;
          max-height: 100%;
          min-height: 0;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          padding-bottom: 0 !important;
        }

        .news-form-modal-wrap {
          height: 100vh !important;
          max-height: 100vh !important;
          overflow: auto !important;
          touch-action: pan-y !important;
          -webkit-overflow-scrolling: touch !important;
        }

        .news-form-modal-wrap :global(.ant-modal-wrap) {
          height: 100% !important;
          max-height: 100% !important;
          overflow: auto !important;
          touch-action: pan-y !important;
        }

        .news-form-modal :global(.ant-modal) {
          min-height: 0 !important;
          max-height: 100vh !important;
        }

        .news-form-modal :global(.ant-modal-content) {
          overscroll-behavior: contain;
        }

        .news-form-modal :global(.ant-modal-body) {
          touch-action: pan-y;
          overscroll-behavior: contain;
        }

        @media (max-width: 1024px) {
          .news-form-modal :global(.ant-modal) {
            width: 90vw !important;
            margin: 0 auto !important;
          }
        }

        @media (max-width: 768px) {
          .news-form-modal :global(.ant-modal) {
            width: 95vw !important;
            margin: 0 auto !important;
            top: 10px !important;
          }

          .news-form-modal :global(.ant-modal-content) {
            max-height: 95vh;
            height: 95vh;
          }

          .news-form-modal :global(.ant-modal-body) {
            height: 100% !important;
            max-height: 100% !important;
          }
        }
      `}</style>
    </div>
  );
};

export default NewsList;