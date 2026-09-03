import { Button, InputRef, Modal, Typography } from "antd";
import { MoreVertical, Plus } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import useSWR, { mutate } from "swr";

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

  // Backend (NewsQueryBuilder) đã lọc đúng SourceType và fromDate/toDate rồi,
  // nên không cần tự fetch 10000 bản ghi rồi lọc lại ở client nữa — cách cũ này
  // còn là nguyên nhân khiến việc xoá filter không tự tải lại đúng (SWR key
  // không đổi vì SourceType/fromDate/toDate luôn bị loại khỏi request).
  const { data, isLoading, isValidating } = newsApi.useGet(opts);
  const newsItems = data?.data ?? [];
  const [previewNews, setPreviewNews] = useState<INewsResponse | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Đếm số bài đang "Chờ duyệt" để hiển thị badge — dùng chung tiền tố key
  // "News" nên newsApi.revalidate() (gọi sau mỗi lần sửa/duyệt/từ chối bài)
  // cũng tự làm mới luôn số đếm này.
  const { data: pendingCountData } = useSWR(
    ["News", "count", { NeedsApproval: true }],
    () => newsApi.count({ NeedsApproval: true } as any)
  );
  const pendingCount = pendingCountData?.data ?? 0;
  const isPendingFilterActive = String(opts.NeedsApproval ?? "") === "true";

  const handleTogglePendingFilter = () => {
    handleFilter({
      ...opts,
      NeedsApproval: isPendingFilterActive ? undefined : true,
    });
  };

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
  newsApi.revalidate();
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

      <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "16px 0 12px" }}>
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

        {/* Bấm để lọc nhanh các bài đang chờ duyệt (bao gồm cả bài vừa
            sửa xong — sau khi sửa, bài sẽ tự quay về trạng thái này) */}
        {pendingCount > 0 && (
          <button
            type="button"
            onClick={handleTogglePendingFilter}
            className={`news-pending-badge${isPendingFilterActive ? " news-pending-badge--active" : ""}`}
            title="Xem các bài đang chờ duyệt"
          >
            Chờ duyệt ({pendingCount})
          </button>
        )}
      </div>

      {/* Filter + nút Viết bài cùng một hàng */}
      <NewsFilter model={opts} onSubmit={handleFilter} extra={createNewsButton} />

      {/* News Type Tabs */}
      <NewsTypeTabs opts={opts} onSubmit={handleFilter} />


      {/* News Table */}
      <div className="news-table">
        <TableBase
          loading={isLoading || isValidating}
          total={data?.totalRow ?? 0}
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
