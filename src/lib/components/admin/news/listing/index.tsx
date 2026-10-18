import { Button, ConfigProvider, InputRef, Modal, Typography } from "antd";
import { CirclePlus, MoreVertical, Plus, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import useSWR, { mutate } from "swr";

import MyBreadcrumb from "@/lib/components/shared/MyBreadcrumb";
import TableBase from "@/lib/components/shared/TableBase";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import { baseFilter } from "@/lib/core/configs/appConst";
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

const NewsEmptyState = () => (
  <div className="news-empty-state" role="status" aria-live="polite">
    <svg className="news-empty-state-icon" viewBox="0 0 72 72" aria-hidden="true">
      <circle cx="36" cy="36" r="32" fill="#F2EFFF" />
      <path
        d="M24 18h17l10 10v25a3 3 0 0 1-3 3H24a3 3 0 0 1-3-3V21a3 3 0 0 1 3-3Z"
        fill="#fff"
        stroke="#D8D2F5"
        strokeWidth="2"
      />
      <path d="M41 18v10h10" fill="none" stroke="#D8D2F5" strokeWidth="2" />
      <path d="M28 37h12M28 42h9" stroke="#C7C0E9" strokeWidth="2" strokeLinecap="round" />
      <circle cx="48" cy="47" r="10" fill="#7668E8" />
      <path d="m45 44 6 6m0-6-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    </svg>
    <span>Không tìm thấy dữ liệu</span>
  </div>
);

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

  // Dùng thẳng NewsCount backend đã tính đúng qua subquery — không tự đếm lại nữa
  const allCount = tagsData.reduce((sum, item) => sum + (item.NewsCount ?? 0), 0);

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
          return (
            <button
              key={item.Id}
              type="button"
              className={`news-type-tab ${
                selectedTags.includes(tagId) ? "active" : ""
              }`}
              onClick={() => handleChange(tagId)}
            >
              {item.Name} ({item.NewsCount ?? 0})
            </button>
          );
        })}
      </div>

      <div className="news-type-tabs-actions">
        <Button
          className="news-add-type-btn"
          icon={<CirclePlus size={16} />}
          onClick={() => setOpenAddModal(true)}
        >
          Thêm
        </Button>
        <Button
          className="news-more-btn"
          aria-label="Quản lý loại tin tức"
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
        centered
        width={384}
      >
        <div className="news-type-modal-wrapper">
          <div className="news-type-modal-header">
            <div>
              <div className="news-type-modal-title">Loại tin tức</div>
            </div>
            <button
              type="button"
              className="news-type-modal-close"
              onClick={() => setOpenModal(false)}
              aria-label="Đóng"
            >
              <X size={24} />
            </button>
          </div>

          <div className="news-type-modal-body">
            <NewsTypeTable loading={false} data={tagsData} />
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
};const NewsList = () => {
  const router = useRouter();
  const pathname = usePathname();
  const query = useSearchParams();
  const [isNewsFormModalOpen, setIsNewsFormModalOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<INewsResponse | undefined>();

  const opts = useMemo(() => ({
    pageIndex: 1,
    pageSize: baseFilter.pageSize,
    ...Object.fromEntries(query?.entries() ?? []),
  } as unknown as INewsOpts), [query]);

  const handleFilter = (values: INewsOpts) => {
    router.push(`${pathname}?${objToQueryString({ ...opts, ...values, pageIndex: 1 })}`);
  };

  const handlePageIndexChange = (pageIndex: number, pageSize: number) => {
    router.push(
      `${pathname}?${objToQueryString({ ...opts, pageIndex: Number(opts.pageSize) === pageSize ? pageIndex : 1, pageSize })}`
    );
  };

  // Backend (NewsQueryBuilder) đã lọc đúng SourceType và fromDate/toDate rồi,
  // nên không cần tự fetch 10000 bản ghi rồi lọc lại ở client nữa — cách cũ này
  // còn là nguyên nhân khiến việc xoá filter không tự tải lại đúng (SWR key
  // không đổi vì SourceType/fromDate/toDate luôn bị loại khỏi request).
  const { data, isLoading, isValidating } = newsApi.useGet(opts);
  const { data: countData } = useSWR(
    [newsApi.mutateKey, "count", opts],
    () => newsApi.count(opts)
  );
  const newsItems = data?.data ?? [];
  const [previewNews, setPreviewNews] = useState<INewsResponse | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleOpenNewNewsForm = () => {
    setSelectedNews(undefined);
    setIsNewsFormModalOpen(true);
  };

  const handleOpenEditNewsForm = async (item: INewsResponse) => {
    // ⚠️ Luôn lấy bản mới nhất từ server trước khi mở form sửa.
    // Trước đây nếu `item.Content` đã có sẵn (gần như luôn đúng vì API
    // danh sách /News trả về Content đầy đủ cho mọi bản ghi) thì code sẽ
    // dùng thẳng `item` — tức là dữ liệu đang nằm trong SWR cache của
    // danh sách, có thể là dữ liệu CŨ nếu cache chưa kịp revalidate sau
    // lần sửa/gửi duyệt trước đó. Đây là nguyên nhân khiến sửa bài xong,
    // mở lại để gửi duyệt lần nữa vẫn thấy nội dung cũ.
    if (!item.Id) {
      setSelectedNews(item);
      setIsNewsFormModalOpen(true);
      return;
    }

    try {
      const res = await newsApi.getById(item.Id);
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

  const handleRejectNews = async (item: INewsResponse, reason: string) => {
  await newsApi.reject(item.Id ?? 0, reason);
  await newsApi.revalidate();
  handleCloseNewsFormModal();
};

  const handleApproveNews = async (item: INewsResponse) => {
    await newsApi.approve(item.Id ?? 0);
    await newsApi.revalidate();
    handleCloseNewsFormModal();
  };

  const handleOpenPreview = async (item: INewsResponse) => {
    if (!item.Id) return;

    // Cùng lý do như handleOpenEditNewsForm: không dùng thẳng `item` từ
    // cache danh sách vì Content luôn có sẵn nên nhánh fetch mới trước đây
    // gần như không bao giờ chạy, khiến preview hiển thị bản cũ.
    try {
      const res = await newsApi.getById(item.Id);
      setPreviewNews(res.data);
      setPreviewOpen(true);
    } catch (error) {
      console.error("Failed to load news preview", error);
      setPreviewNews(item);
      setPreviewOpen(true);
    }
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
    setPreviewNews(null);
  };

  const newsColumns = useNewsColumns(handleOpenPreview, handleOpenEditNewsForm);

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
    <ConfigProvider theme={{ token: {
      colorPrimary: "#0588f0",
      colorPrimaryHover: "#0d74ce",
      colorPrimaryActive: "#0d74ce",
      colorBorder: "#e5e5e5",
      colorText: "#0a0a0a",
      borderRadius: 10,
    }, components: {
      Button: { defaultHoverBg: "#ffffff", defaultHoverBorderColor: "#aeb4bf", defaultHoverColor: "#0a0a0a" },
    } }}>
    <div className="news-listing">
      <MyBreadcrumb
        items={[{ url: AppRoutes.config.url, name: "Quản lý nội dung" }]}
        current={AppRoutes.news.name}
      />

      <div style={{ display: "flex", alignItems: "center", gap: 12, margin: 0 }}>
        <Typography.Title
          level={4}
          style={{
            margin: 0,
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

      </div>

      {/* Filter + nút Viết bài cùng một hàng */}
      <NewsFilter model={opts} onSubmit={handleFilter} extra={createNewsButton} />

      <section
        className={`news-data-panel${!isLoading && !isValidating && newsItems.length === 0 ? " news-data-panel--empty" : ""}`}
        aria-label="Danh sách tin tức"
      >
      <NewsTypeTabs opts={opts} onSubmit={handleFilter} />


      {/* News Table */}
      <div className={`news-table${!isLoading && !isValidating && newsItems.length === 0 ? " news-table--empty" : ""}`}>
        {!isLoading && !isValidating && newsItems.length === 0 ? (
          <NewsEmptyState />
        ) : (
          <TableBase
            loading={isLoading || isValidating}
            total={countData?.data ?? data?.totalRow ?? 0}
            searchOptions={opts}
            data={newsItems}
            cols={newsColumns}
            onPageIndexChange={handlePageIndexChange}
          />
        )}
      </div>
      </section>

      {previewNews && (
        <NewPreview
          model={previewNews}
          isModalOpen={previewOpen}
          handleCancel={handleClosePreview}
          onEdit={handleOpenEditNewsForm}
          hiddenEdit={
            [0, 1, 4].includes(previewNews.Status ?? -1) ||
            previewNews.StatusName?.toLocaleLowerCase() === "đang hiển thị" ||
            previewNews.StatusName?.toLocaleLowerCase() === "đã duyệt" ||
            Boolean(previewNews.ApprovedDate || previewNews.ApprovedBy)
          }
        />
      )}

      {/* News Form Modal */}
      <Modal
        title={null}
        open={isNewsFormModalOpen}
        onCancel={handleCloseNewsFormModal}
        footer={null}
        width={1152}
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
        destroyOnHidden
        centered
        closeIcon={null}
      >
        <NewsForm
          key={selectedNews?.Id ?? "new-news"}
          model={selectedNews}
          onClose={handleCloseNewsFormModal}
          hideHeader={false}
          onReject={handleRejectNews}
          onApprove={handleApproveNews}
        />
      </Modal>

    </div>
    </ConfigProvider>
  );
};

export default NewsList;
