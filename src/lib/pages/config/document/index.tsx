"use client";

import dayjs from "dayjs";
import JSZip from "jszip";
import {
  Calendar,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  Eye,
  FileText,
  FileType2,
  Loader2,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { mutate } from "swr";

import { baseFilter } from "@/lib/core/configs/appConst";
import TitlePage from "@/lib/core/layout/components/TitlePage";
import { FormatDate } from "@/lib/core/utils/myFormat";
import documentApi from "@/services/api/document/documentApi";
import documentTypeApi from "@/services/api/document/documentTypeApi";
import type { IDocumentResponse, IDocumentTypeResponse } from "@/services/api/document/IDocument";

import AddEditDocument from "./addEdit";

const canManage = (roleId?: number) => [1, 2].includes(roleId ?? 0);
const PAGE_SIZE_OPTIONS = [10, 20, 50];

type DocumentMetadata = IDocumentResponse & {
  Code?: string;
  PageCount?: number;
  Pages?: number;
  PostedDate?: string;
  PublishedDate?: string;
  ApprovedBy?: string;
  ApprovedDate?: string;
  Status?: number;
  StatusName?: string;
};

const getFileUrl = (value: unknown): string | undefined => {
  const item = Array.isArray(value) ? value[0] : value;
  if (typeof item === "string") return item.split("|")[0]?.trim() || undefined;
  if (item && typeof item === "object") {
    const file = item as { url?: string; Path?: string };
    return file.url ?? file.Path;
  }
  return undefined;
};

const readPageCount = async (document: DocumentMetadata): Promise<number | undefined> => {
  if (document.PageCount ?? document.Pages) return document.PageCount ?? document.Pages;
  const url = getFileUrl(document.PdfFile) ?? getFileUrl(document.DocFile);
  if (!url) return undefined;

  try {
    const response = await fetch(url);
    if (!response.ok) return undefined;
    const bytes = await response.arrayBuffer();
    if (/\.pdf(?:$|[?#])/i.test(url) || getFileUrl(document.PdfFile) === url) {
      const pdfText = new TextDecoder("latin1").decode(bytes);
      const pageTreeCounts = [...pdfText.matchAll(/\/Type\s*\/Pages\b[\s\S]{0,2048}?\/Count\s+(\d+)/g)].map(
        (match) => Number(match[1])
      );
      if (pageTreeCounts.length) return Math.max(...pageTreeCounts);
      const pageObjects = pdfText.match(/\/Type\s*\/Page\b/g)?.length;
      return pageObjects || undefined;
    }

    if (/\.docx(?:$|[?#])/i.test(url)) {
      const zip = await JSZip.loadAsync(bytes);
      const xml = await zip.file("word/document.xml")?.async("string");
      if (!xml) return undefined;
      const renderedBreaks = xml.match(/<(?:\w+:)?lastRenderedPageBreak\b/g)?.length ?? 0;
      const explicitBreaks = xml.match(/<(?:\w+:)?br\b[^>]*(?:\w+:)?type=["']page["'][^>]*\/?\s*>/g)?.length ?? 0;
      const breaks = Math.max(renderedBreaks, explicitBreaks);
      return breaks ? breaks + 1 : undefined;
    }
  } catch {
    // File hosts can disallow browser access (CORS); keep the count empty then.
  }
  return undefined;
};

const statusPresentation = (status?: string) => {
  const value = status?.toLocaleLowerCase("vi") ?? "";
  if (value.includes("duyệt") && !value.includes("chờ")) return { className: "approved", Icon: Check };
  if (value.includes("từ chối") || value.includes("hủy")) return { className: "rejected", Icon: X };
  if (value.includes("chờ") || value.includes("chưa")) return { className: "pending", Icon: Clock3 };
  return { className: "unknown", Icon: CircleHelp };
};

const DocumentPage = () => {
  const { data: session } = useSession();
  const [openModal, setOpenModal] = useState(false);
  const [selected, setSelected] = useState<IDocumentResponse>();
  const [viewing, setViewing] = useState<DocumentMetadata>();
  const [confirmDeleteId, setConfirmDeleteId] = useState<number>();
  const [keyword, setKeyword] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [searchText, setSearchText] = useState("");
  const [pageCounts, setPageCounts] = useState<Record<number, number>>({});
  const requestedPageCounts = useRef(new Set<number>());
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const isAdmin = canManage(session?.user?.RoleId);

  const { data: types, isLoading: loadingTypes } = documentTypeApi.useGet(baseFilter);
  const { data: docs, isLoading: loadingDocuments } = documentApi.useGet({
    pageIndex: 1,
    pageSize: 1000,
  });
  const categories = types?.data ?? [];
  const documents = (docs?.data ?? []) as DocumentMetadata[];

  const statusOptions = useMemo(() => {
    const names = new Set(documents.map((document) => document.StatusName?.trim()).filter(Boolean) as string[]);
    ["Đã duyệt", "Chờ duyệt", "Từ chối"].forEach((name) => {
      if (![...names].some((value) => value.toLocaleLowerCase("vi") === name.toLocaleLowerCase("vi"))) {
        names.add(name);
      }
    });
    return [...names];
  }, [documents]);

  const filteredDocuments = useMemo(() => {
    const normalizedSearch = searchText.trim().toLocaleLowerCase("vi");
    const from = dateFrom ? dayjs(dateFrom) : null;
    const to = dateTo ? dayjs(dateTo) : null;
    return documents.filter((document) => {
      const documentDate = dayjs(document.PostedDate ?? document.PublishedDate ?? document.CreatedDate);
      const matchesSearch =
        !normalizedSearch ||
        [document.Code, document.Id?.toString(), document.Name, document.Note]
          .filter(Boolean)
          .some((value) => value?.toLocaleLowerCase("vi").includes(normalizedSearch));
      const matchesType = !selectedType || String(document.DocumentTypeId) === selectedType;
      const matchesStatus =
        !selectedStatus || (document.StatusName ?? "").toLocaleLowerCase("vi") === selectedStatus.toLocaleLowerCase("vi");
      const matchesStart = !from || !documentDate.isValid() || !documentDate.isBefore(from, "day");
      const matchesEnd = !to || !documentDate.isValid() || !documentDate.isAfter(to, "day");
      return matchesSearch && matchesType && matchesStatus && matchesStart && matchesEnd;
    });
  }, [dateFrom, dateTo, documents, searchText, selectedStatus, selectedType]);

  useEffect(() => {
    setPage(1);
  }, [dateFrom, dateTo, searchText, selectedStatus, selectedType]);

  const totalPages = Math.max(1, Math.ceil(filteredDocuments.length / pageSize));
  const pagedDocuments = filteredDocuments.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    let cancelled = false;
    const missingCounts = pagedDocuments.filter(
      (document) =>
        document.Id &&
        pageCounts[document.Id] === undefined &&
        !requestedPageCounts.current.has(document.Id) &&
        (document.PdfFile || document.DocFile)
    );
    if (!missingCounts.length) return;
    missingCounts.forEach((document) => requestedPageCounts.current.add(document.Id as number));
    Promise.all(
      missingCounts.map(async (document) => ({
        id: document.Id as number,
        count: await readPageCount(document),
      }))
    ).then((results) => {
      if (cancelled) return;
      setPageCounts((current) => {
        const next = { ...current };
        results.forEach(({ id, count }) => {
          if (count !== undefined) next[id] = count;
        });
        return next;
      });
    });
    return () => {
      cancelled = true;
    };
  }, [pageCounts, pagedDocuments]);

  const openAdd = () => {
    setSelected(undefined);
    setOpenModal(true);
  };

  const resetFilters = () => {
    setDateFrom("");
    setDateTo("");
    setSelectedStatus("");
    setSelectedType("");
    setKeyword("");
    setSearchText("");
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    await documentApi.delete(id);
    await mutate(documentApi.mutateKey);
    setConfirmDeleteId(undefined);
  };

  const pdfUrl = viewing?.PdfFile ? String(viewing.PdfFile) : undefined;
  const docUrl = viewing?.DocFile ? String(viewing.DocFile) : undefined;

  return (
    <div className="document-management-page">
      <div className="document-management-heading">
        <div className="document-management-breadcrumb">
          <span className="text-secondary">Danh sách văn bản</span>
          <span>/</span>
          <span>Hợp đồng</span>
        </div>
        <TitlePage title="Hợp đồng" />
      </div>

      <div className="document-management-card">
        <div className="document-filter-row">
          <div className="document-filter-item document-filter-date-from document-floating-field">
            <span className="document-floating-label">
              <Calendar size={13} /> Từ ngày
            </span>
            <input
              type="date"
              value={dateFrom}
              onChange={(event) => setDateFrom(event.target.value)}
              className="document-floating-control document-date-input"
            />
          </div>

          <div className="document-filter-item document-filter-date-to document-floating-field">
            <span className="document-floating-label">
              <Calendar size={13} /> Đến ngày
            </span>
            <input
              type="date"
              value={dateTo}
              onChange={(event) => setDateTo(event.target.value)}
              className="document-floating-control document-date-input"
            />
          </div>

          <div className="document-filter-item document-filter-status document-floating-field">
            <span className="document-floating-label">Trạng thái</span>
            <select
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
              className="document-floating-control document-select"
            >
              <option value="">Chọn</option>
              {statusOptions.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="document-select-chevron" />
          </div>

          <div className="document-filter-item document-filter-type document-floating-field">
            <span className="document-floating-label">
              Tài liệu <span className="document-floating-required">*</span>
            </span>
            <select
              value={selectedType}
              onChange={(event) => setSelectedType(event.target.value)}
              className="document-floating-control document-select"
            >
              <option value="">Chọn</option>
              {categories.map((type: IDocumentTypeResponse) => (
                <option key={type.Id} value={String(type.Id ?? 0)}>
                  {type.Name}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="document-select-chevron" />
          </div>

          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") setSearchText(keyword);
            }}
            placeholder="Tìm kiếm văn bản"
            className="document-filter-search"
          />

          <button type="button" className="document-search-btn" onClick={() => setSearchText(keyword)}>
            <Search size={16} /> Tìm kiếm
          </button>

          <button
            type="button"
            title="Đặt lại bộ lọc"
            aria-label="Đặt lại bộ lọc"
            className="document-reset-btn"
            onClick={resetFilters}
          >
            <RotateCcw size={16} />
          </button>
        </div>

        <div className="document-table-toolbar">
          <button
            type="button"
            className="document-primary-btn"
            onClick={openAdd}
            disabled={!isAdmin}
            title={isAdmin ? undefined : "Bạn không có quyền thêm văn bản"}
          >
            <Plus size={16} /> Thêm mới
          </button>
        </div>

        {loadingTypes ? (
          <div className="document-table-loading">
            <Loader2 className="document-spinner" size={28} />
          </div>
        ) : (
          <div className="document-table-scroll">
            <table className="document-table">
              <thead>
                <tr>
                  <th className="col-code">Mã</th>
                  <th className="col-name">Tên văn bản</th>
                  <th className="col-optional col-optional-lg">Danh mục</th>
                  <th className="col-optional col-optional-md text-center">Số trang</th>
                  <th className="col-optional col-optional-sm">Ngày đăng</th>
                  <th className="col-optional col-optional-xl">Người duyệt</th>
                  <th>Trạng thái</th>
                  <th className="text-center">Chức năng</th>
                </tr>
              </thead>
              <tbody>
                {loadingDocuments ? (
                  <tr>
                    <td colSpan={8} className="document-table-empty">
                      Đang tải...
                    </td>
                  </tr>
                ) : pagedDocuments.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="document-table-empty">
                      Không có dữ liệu
                    </td>
                  </tr>
                ) : (
                  pagedDocuments.map((document) => {
                    const count = document.PageCount ?? document.Pages ?? (document.Id ? pageCounts[document.Id] : undefined);
                    const { className: statusClass, Icon: StatusIcon } = statusPresentation(document.StatusName);
                    return (
                      <tr key={document.Id}>
                        <td className="col-code">{document.Code || (document.Id ? String(document.Id) : "—")}</td>
                        <td className="col-name" title={document.Name}>
                          <span className="document-table-name">{document.Name || "—"}</span>
                        </td>
                        <td className="col-optional col-optional-lg">
                          {categories.find((type) => type.Id === document.DocumentTypeId)?.Name ?? "—"}
                        </td>
                        <td className="col-optional col-optional-md text-center">
                          {count ? (
                            <span className="document-page-count">
                              <FileText size={14} />
                              {count}
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="col-optional col-optional-sm">
                          {FormatDate(document.PostedDate ?? document.PublishedDate ?? document.CreatedDate) || "—"}
                        </td>
                        <td className="col-optional col-optional-xl">
                          {document.ApprovedBy ? (
                            <div className="document-approver">
                              <span className="document-approver-name">
                                <UserRound size={14} />
                                {document.ApprovedBy}
                              </span>
                              {document.ApprovedDate && (
                                <span className="document-approver-date">{FormatDate(document.ApprovedDate)}</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-secondary">—</span>
                          )}
                        </td>
                        <td>
                          {document.StatusName ? (
                            <span className={`document-status ${statusClass}`}>
                              <StatusIcon size={13} />
                              {document.StatusName}
                            </span>
                          ) : (
                            <span className="text-secondary">—</span>
                          )}
                        </td>
                        <td>
                          <div className="document-actions">
                            <button
                              type="button"
                              className="document-icon-btn"
                              aria-label={`Xem ${document.Name}`}
                              title="Xem văn bản"
                              onClick={() => setViewing(document)}
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              type="button"
                              className="document-icon-btn"
                              disabled={!isAdmin}
                              aria-label={`Sửa ${document.Name}`}
                              title={isAdmin ? "Chỉnh sửa" : "Bạn không có quyền chỉnh sửa"}
                              onClick={() => {
                                setSelected(document);
                                setOpenModal(true);
                              }}
                            >
                              <Pencil size={16} />
                            </button>
                            <div className="document-confirm-wrap">
                              <button
                                type="button"
                                className="document-icon-btn danger"
                                disabled={!isAdmin}
                                aria-label={`Xóa ${document.Name}`}
                                title={isAdmin ? "Xóa văn bản" : "Bạn không có quyền xóa"}
                                onClick={() => setConfirmDeleteId(document.Id)}
                              >
                                <Trash2 size={16} />
                              </button>
                              {confirmDeleteId === document.Id && (
                                <div className="document-confirm-popover" role="dialog">
                                  <p>Xóa văn bản này?</p>
                                  <div className="document-confirm-actions">
                                    <button type="button" onClick={() => setConfirmDeleteId(undefined)}>
                                      Hủy
                                    </button>
                                    <button type="button" className="danger" onClick={() => handleDelete(document.Id)}>
                                      Xóa
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="document-pagination">
          <div className="document-pagination-summary">
            <span>
              {filteredDocuments.length === 0
                ? "0 dòng"
                : `${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, filteredDocuments.length)} trong ${filteredDocuments.length} dòng`}
            </span>
            <select
              value={pageSize}
              onChange={(event) => {
                setPageSize(Number(event.target.value));
                setPage(1);
              }}
              className="document-page-size-select"
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size} / trang
                </option>
              ))}
            </select>
          </div>
          <div className="document-pagination-controls">
            <button type="button" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>
              Trước
            </button>
            <span>
              Trang {page} / {totalPages}
            </span>
            <button type="button" disabled={page >= totalPages} onClick={() => setPage((current) => current + 1)}>
              Sau
            </button>
          </div>
        </div>
      </div>

      <AddEditDocument
        isOpen={openModal}
        onOpenChange={(isOpen) => {
          setOpenModal(isOpen);
          if (!isOpen) setSelected(undefined);
        }}
        types={categories}
        model={selected}
      />

      {viewing && (
        <div className="document-view-overlay" role="presentation" onClick={() => setViewing(undefined)}>
          <div className="document-view-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <div className="document-view-header">
              <h3>{viewing.Name || "Thông tin văn bản"}</h3>
              <button type="button" className="document-icon-btn" aria-label="Đóng" onClick={() => setViewing(undefined)}>
                <X size={18} />
              </button>
            </div>

            <div className="document-view-body">
              <div className="document-view-main">
                <div className="document-view-meta">
                  <div className="document-view-meta-row">
                    <div>
                      <span className="label">Tài liệu: </span>
                      {categories.find((type) => type.Id === viewing.DocumentTypeId)?.Name ?? "—"}
                    </div>
                    <div>
                      <span className="label">Trạng thái: </span>
                      <span className={`document-status-inline ${statusPresentation(viewing.StatusName).className}`}>
                        {viewing.StatusName || "—"}
                      </span>
                    </div>
                  </div>
                  <div className="document-view-meta-row">
                    <div>
                      <span className="label">Ngày đăng: </span>
                      {FormatDate(viewing.PostedDate ?? viewing.PublishedDate ?? viewing.CreatedDate) || "—"}
                    </div>
                    {viewing.ApprovedDate && (
                      <div>
                        <span className="label">Ngày duyệt: </span>
                        {FormatDate(viewing.ApprovedDate)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="document-view-preview">
                  {pdfUrl ? (
                    <iframe src={pdfUrl} title="Xem trước văn bản" />
                  ) : (
                    <div className="document-view-empty">Chưa có bản xem trước cho văn bản này</div>
                  )}
                </div>
              </div>

              <div className="document-view-side">
                <div className="document-view-history">
                  <div className="document-view-history-title">Lịch sử trạng thái</div>
                  {viewing.ApprovedDate ? (
                    <div className="document-view-history-item">
                      <span className="dot" />
                      <div>
                        <div>
                          <span className="label">Thời gian: </span>
                          {FormatDate(viewing.ApprovedDate)}
                        </div>
                        {viewing.ApprovedBy && (
                          <div>
                            <span className="label">Người thực hiện: </span>
                            {viewing.ApprovedBy}
                          </div>
                        )}
                        <div className="strong">đã duyệt văn bản</div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-secondary">Chưa có lịch sử trạng thái</p>
                  )}
                </div>

                <div className="document-view-download">
                  <div className="label">Tải về</div>
                  <div className="document-view-download-row">
                    {pdfUrl && (
                      <a href={pdfUrl} target="_blank" rel="noreferrer" title="Tải file PDF" className="pdf">
                        <FileText size={28} />
                        <span>PDF</span>
                      </a>
                    )}
                    {docUrl && (
                      <a href={docUrl} target="_blank" rel="noreferrer" title="Tải file Word" className="docx">
                        <FileType2 size={28} />
                        <span>DOCX</span>
                      </a>
                    )}
                    {!pdfUrl && !docUrl && <span className="text-secondary">Không có tệp đính kèm</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .document-management-page {
          min-height: 100%;
          padding: 20px;
          background: #fbfbfd;
          font-family: Inter, sans-serif;
        }

        .document-management-heading {
          margin-bottom: 14px;
        }

        .document-management-breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
          font-size: 12px;
        }

        .text-secondary {
          color: #858b98;
        }

        .document-management-card {
          padding: 16px;
          background: #fff;
          border: 1px solid #edf0f3;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgb(20 31 55 / 4%);
        }

        .document-filter-row {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px 24px;
          margin-bottom: 18px;
        }

        .document-floating-field {
          position: relative;
          display: flex;
          align-items: center;
          height: 40px;
          padding: 0 12px;
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 10px;
        }

        .document-floating-label {
          position: absolute;
          top: -9px;
          left: 11px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 0 4px;
          background: #fff;
          color: #737373;
          font-size: 12px;
          line-height: 16px;
          white-space: nowrap;
        }

        .document-floating-required {
          color: #ef4444;
          font-size: 10px;
        }

        .document-filter-date-from,
        .document-filter-date-to {
          flex: 0 0 190px;
        }

        .document-filter-status,
        .document-filter-type {
          flex: 0 0 220px;
        }

        .document-date-input {
          border: none;
          outline: none;
          width: 100%;
          min-width: 0;
          font-size: 13px;
          color: #0a0a0a;
          background: transparent;
        }

        .document-select {
          appearance: none;
          border: none;
          outline: none;
          width: 100%;
          height: 100%;
          padding-right: 20px;
          font-size: 14px;
          color: #0a0a0a;
          background: transparent;
        }

        .document-select-chevron {
          position: absolute;
          right: 12px;
          color: #737373;
          pointer-events: none;
        }

        .document-filter-search {
          flex: 1 1 220px;
          min-width: 0;
          height: 40px;
          padding: 0 12px;
          font-size: 14px;
          color: #0a0a0a;
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 10px;
          outline: none;
        }

        .document-filter-search::placeholder {
          color: #a1a1aa;
        }

        .document-search-btn {
          display: inline-flex;
          flex: 0 0 auto;
          align-items: center;
          gap: 8px;
          height: 40px;
          padding: 0 16px;
          color: #fff;
          font-size: 14px;
          font-weight: 500;
          white-space: nowrap;
          background: #0588f0;
          border: none;
          border-radius: 10px;
          cursor: pointer;
        }

        .document-search-btn:hover {
          background: #0473cc;
        }

        .document-reset-btn {
          display: inline-flex;
          flex: 0 0 auto;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          color: #434547;
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 10px;
          cursor: pointer;
        }

        .document-reset-btn:hover {
          background: #f5f5f5;
        }

        .document-table-toolbar {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 12px;
        }

        .document-primary-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          height: 40px;
          padding: 0 16px;
          color: #fff;
          font-size: 14px;
          font-weight: 500;
          background: #0588f0;
          border: none;
          border-radius: 10px;
          cursor: pointer;
        }

        .document-primary-btn:hover {
          background: #0473cc;
        }

        .document-primary-btn:disabled {
          background: #c9d2da;
          cursor: not-allowed;
        }

        .document-table-scroll {
          overflow-x: auto;
        }

        .document-table {
          width: 100%;
          min-width: 720px;
          border-collapse: collapse;
        }

        .document-table thead th {
          padding: 10px 12px;
          color: #343a46;
          font-size: 12px;
          font-weight: 600;
          text-align: left;
          white-space: nowrap;
          background: #f4f5f7;
        }

        .document-table tbody td {
          padding: 10px 12px;
          border-bottom: 1px solid #f0f1f3;
          font-size: 12px;
          white-space: nowrap;
        }

        .col-name {
          max-width: 320px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .document-table-name {
          color: #282c35;
          font-weight: 500;
        }

        .text-center {
          text-align: center;
        }

        .document-table-empty {
          padding: 32px 12px;
          color: #858b98;
          text-align: center;
        }

        .document-page-count {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          color: #272b35;
          font-weight: 500;
          font-variant-numeric: tabular-nums;
        }

        .document-page-count :global(svg) {
          color: #717887;
        }

        .document-approver {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .document-approver-name {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          overflow: hidden;
          color: #20242d;
          font-weight: 500;
          text-overflow: ellipsis;
        }

        .document-approver-name :global(svg) {
          flex: 0 0 auto;
          color: #717887;
        }

        .document-approver-date {
          padding-left: 19px;
          color: #858b98;
          font-size: 11px;
        }

        .document-status,
        .document-status-inline {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 2px 8px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 500;
          white-space: nowrap;
        }

        .document-status.approved,
        .document-status-inline.approved {
          color: #16834a;
          background: #e8f7ee;
        }

        .document-status.pending,
        .document-status-inline.pending {
          color: #2764c5;
          background: #eaf2ff;
        }

        .document-status.rejected,
        .document-status-inline.rejected {
          color: #c63d43;
          background: #fff0f0;
        }

        .document-status.unknown,
        .document-status-inline.unknown {
          color: #606775;
          background: #f1f2f4;
        }

        .document-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
        }

        .document-icon-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          color: #434547;
          background: transparent;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .document-icon-btn:hover {
          background: #f0f1f3;
        }

        .document-icon-btn:disabled {
          color: #c9ced6;
          cursor: not-allowed;
        }

        .document-icon-btn.danger:not(:disabled):hover {
          color: #c63d43;
          background: #fff0f0;
        }

        .document-confirm-wrap {
          position: relative;
        }

        .document-confirm-popover {
          position: absolute;
          top: calc(100% + 6px);
          right: 0;
          z-index: 10;
          width: 180px;
          padding: 12px;
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          box-shadow: 0 8px 24px rgb(20 31 55 / 12%);
        }

        .document-confirm-popover p {
          margin: 0 0 10px;
          color: #282c35;
          font-size: 12px;
          text-align: left;
          white-space: normal;
        }

        .document-confirm-actions {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
        }

        .document-confirm-actions button {
          padding: 4px 10px;
          font-size: 12px;
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 6px;
          cursor: pointer;
        }

        .document-confirm-actions button.danger {
          color: #fff;
          background: #ef4444;
          border-color: #ef4444;
        }

        .document-pagination {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-top: 12px;
        }

        .document-pagination-summary {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #555b66;
          font-size: 12px;
        }

        .document-page-size-select {
          height: 28px;
          padding: 0 8px;
          font-size: 12px;
          border: 1px solid #e5e5e5;
          border-radius: 6px;
        }

        .document-pagination-controls {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 12px;
        }

        .document-pagination-controls button {
          padding: 5px 12px;
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 6px;
          cursor: pointer;
        }

        .document-pagination-controls button:disabled {
          color: #c9ced6;
          cursor: not-allowed;
        }

        .document-table-loading {
          display: grid;
          min-height: 260px;
          place-items: center;
          color: #0588f0;
        }

        .document-spinner {
          animation: document-spin 0.8s linear infinite;
        }

        @keyframes document-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .document-view-overlay {
          position: fixed;
          inset: 0;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: rgb(0 0 0 / 45%);
        }

        .document-view-modal {
          display: flex;
          flex-direction: column;
          width: 100%;
          max-width: 1152px;
          max-height: 90vh;
          overflow: hidden;
          background: #fff;
          border-radius: 12px;
        }

        .document-view-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 24px;
          padding: 16px 24px;
          border-bottom: 1px solid #e5e5e5;
        }

        .document-view-header h3 {
          margin: 0;
          color: #0a0a0a;
          font-size: 18px;
          font-weight: 700;
        }

        .document-view-body {
          display: flex;
          flex: 1;
          gap: 24px;
          padding: 24px;
          overflow: auto;
        }

        .document-view-main {
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: 12px;
          min-width: 0;
        }

        .document-view-meta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 6px;
          font-size: 14px;
        }

        .document-view-meta .label {
          color: #737373;
          font-weight: 600;
        }

        .document-view-preview {
          position: relative;
          height: 480px;
          overflow: auto;
          background: #f5f5f5;
          box-shadow: 0 0 10px rgb(136 136 136 / 10%);
        }

        .document-view-preview iframe {
          width: 100%;
          height: 100%;
          border: none;
          background: #fff;
        }

        .document-view-empty {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #858b98;
          font-size: 14px;
        }

        .document-view-side {
          display: flex;
          flex: 0 0 340px;
          flex-direction: column;
          gap: 8px;
        }

        .document-view-history {
          padding: 16px;
          background: #fff;
          border: 1px solid #edf0f3;
          border-radius: 8px;
        }

        .document-view-history-title {
          margin-bottom: 16px;
          font-size: 12px;
          font-weight: 600;
        }

        .document-view-history-item {
          display: flex;
          gap: 8px;
          font-size: 13px;
        }

        .document-view-history-item .dot {
          flex: 0 0 auto;
          width: 10px;
          height: 10px;
          margin-top: 4px;
          background: #0588f0;
          border-radius: 50%;
        }

        .document-view-history-item .label {
          color: #737373;
          font-weight: 500;
        }

        .document-view-history-item .strong {
          font-weight: 600;
        }

        .document-view-download {
          padding: 0 4px;
        }

        .document-view-download .label {
          margin-bottom: 12px;
          color: #737373;
          font-size: 12px;
          font-weight: 600;
        }

        .document-view-download-row {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .document-view-download-row a {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          text-decoration: none;
        }

        .document-view-download-row a.pdf {
          color: #ef4444;
        }

        .document-view-download-row a.docx {
          color: #3b82f6;
        }

        .col-optional-lg,
        .col-optional-md,
        .col-optional-sm,
        .col-optional-xl {
          display: table-cell;
        }

        @media (max-width: 1279px) {
          .col-optional-xl {
            display: none;
          }
        }

        @media (max-width: 1023px) {
          .col-optional-lg {
            display: none;
          }
        }

        @media (max-width: 767px) {
          .col-optional-md,
          .col-optional-sm {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .document-management-page {
            padding: 12px;
          }

          .document-management-card {
            padding: 12px;
          }

          .document-filter-row {
            flex-direction: column;
            align-items: stretch;
          }

          .document-filter-date-from,
          .document-filter-date-to,
          .document-filter-status,
          .document-filter-type,
          .document-filter-search,
          .document-search-btn,
          .document-reset-btn {
            flex-basis: auto;
            width: 100%;
          }

          .document-view-body {
            flex-direction: column;
          }

          .document-view-side {
            flex: 1 1 auto;
          }
        }
      `}</style>
    </div>
  );
};

export default DocumentPage;