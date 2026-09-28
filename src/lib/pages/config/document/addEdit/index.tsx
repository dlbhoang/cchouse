"use client";

import { ChevronDown, FileText, Loader2, Paperclip, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { mutate } from "swr";

import documentApi from "@/services/api/document/documentApi";
import type { IDocumentRequest, IDocumentResponse, IDocumentTypeResponse } from "@/services/api/document/IDocument";
import { fileServices } from "@/services/api/services/fileServices";

type Props = {
  model?: IDocumentResponse;
  types: IDocumentTypeResponse[];
  isOpen: boolean;
  onOpenChange: (val: boolean) => void;
};

type FormState = {
  documentTypeId?: number;
  name: string;
  note: string;
};

type FormErrors = Partial<Record<"documentTypeId" | "name", string>>;

const emptyState: FormState = { documentTypeId: undefined, name: "", note: "" };

const AddEditDocument = ({ types = [], model, isOpen, onOpenChange }: Props) => {
  const [form, setForm] = useState<FormState>(emptyState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [docFile, setDocFile] = useState<File | null>(null);
  const [isSubmit, setIsSubmit] = useState(false);

  const pdfInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    setForm({
      documentTypeId: model?.DocumentTypeId,
      name: model?.Name ?? "",
      note: model?.Note ?? "",
    });
    setErrors({});
    setPdfFile(null);
    setDocFile(null);
    if (pdfInputRef.current) pdfInputRef.current.value = "";
    if (docInputRef.current) docInputRef.current.value = "";
  }, [isOpen, model]);

  if (!isOpen) return null;

  const validate = () => {
    const nextErrors: FormErrors = {};
    if (!form.documentTypeId) nextErrors.documentTypeId = "Vui lòng chọn loại văn bản";
    if (!form.name.trim()) nextErrors.name = "Vui lòng nhập tên văn bản";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleClose = () => onOpenChange(false);

  const onSubmit = async () => {
    if (!validate() || !form.documentTypeId) return;
    const documentTypeId = form.documentTypeId;
    try {
      setIsSubmit(true);
      const item: IDocumentRequest = {
        DocumentTypeId: documentTypeId,
        Name: form.name.trim(),
        Note: form.note.trim(),
      };

      // NOTE: fileServices.processFiles historically expected antd's
      // UploadFile[] shape. Since this component no longer imports antd at
      // all (not even its types), the cast below sidesteps that mismatch.
      // Longer term, fileServices' signature should accept plain File[].
      if (pdfFile) {
        const res = await fileServices.processFiles([pdfFile] as never);
        item.PdfFile = res.toString();
      } else if (model?.PdfFile) {
        item.PdfFile = model.PdfFile;
      }

      if (docFile) {
        const res = await fileServices.processFiles([docFile] as never);
        item.DocFile = res.toString();
      } else if (model?.DocFile) {
        item.DocFile = model.DocFile;
      }

      if (model?.Id) await documentApi.update({ ...item, Id: model.Id });
      else await documentApi.add(item);

      handleClose();
    } finally {
      mutate(documentApi.mutateKey);
      setIsSubmit(false);
    }
  };

  return (
    <div className="add-edit-overlay" role="presentation" onClick={handleClose}>
      <div className="add-edit-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <div className="add-edit-header">
          <h3>{model?.Id ? "Chỉnh sửa" : "Thêm văn bản"}</h3>
          <button type="button" className="add-edit-icon-btn" aria-label="Đóng" onClick={handleClose}>
            <X size={18} />
          </button>
        </div>

        <div className="add-edit-body">
          <div className="add-edit-grid">
            <div className="add-edit-field">
              <label>
                Loại văn bản <span className="required">*</span>
              </label>
              <div className={`add-edit-select-wrap ${errors.documentTypeId ? "has-error" : ""}`}>
                <select
                  value={form.documentTypeId ?? ""}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, documentTypeId: event.target.value ? Number(event.target.value) : undefined }))
                  }
                >
                  <option value="">Chọn</option>
                  {types.map((type) => (
                    <option key={type.Id} value={type.Id ?? 0}>
                      {type.Name}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} />
              </div>
              {errors.documentTypeId && <p className="error-text">{errors.documentTypeId}</p>}
            </div>

            <div className="add-edit-field">
              <label>
                Tên văn bản <span className="required">*</span>
              </label>
              <input
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                className={errors.name ? "has-error" : ""}
              />
              {errors.name && <p className="error-text">{errors.name}</p>}
            </div>

            <div className="add-edit-field add-edit-field-full">
              <label>Mô tả / Ghi chú</label>
              <textarea
                value={form.note}
                onChange={(event) => setForm((prev) => ({ ...prev, note: event.target.value }))}
                rows={3}
              />
            </div>

            <div className="add-edit-field">
              <label>File PDF</label>
              <input
                ref={pdfInputRef}
                type="file"
                accept="application/pdf"
                className="hidden-input"
                onChange={(event) => setPdfFile(event.target.files?.[0] ?? null)}
              />
              <button type="button" className="add-edit-file-btn" onClick={() => pdfInputRef.current?.click()}>
                <Paperclip size={16} />
                {pdfFile?.name || (model?.PdfFile ? "Đã có file — chọn để thay thế" : "Chọn file PDF")}
              </button>
            </div>

            <div className="add-edit-field">
              <label>File Word</label>
              <input
                ref={docInputRef}
                type="file"
                accept=".doc,.docx"
                className="hidden-input"
                onChange={(event) => setDocFile(event.target.files?.[0] ?? null)}
              />
              <button type="button" className="add-edit-file-btn" onClick={() => docInputRef.current?.click()}>
                <FileText size={16} />
                {docFile?.name || (model?.DocFile ? "Đã có file — chọn để thay thế" : "Chọn file Word")}
              </button>
            </div>
          </div>
        </div>

        <div className="add-edit-footer">
          <button type="button" className="btn-outline" onClick={handleClose} disabled={isSubmit}>
            Đóng
          </button>
          <button type="button" className="btn-primary" onClick={onSubmit} disabled={isSubmit}>
            {isSubmit && <Loader2 size={16} className="spin" />}
            Lưu
          </button>
        </div>
      </div>

      <style jsx>{`
        .add-edit-overlay {
          position: fixed;
          inset: 0;
          z-index: 1100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: rgb(0 0 0 / 45%);
        }

        .add-edit-modal {
          display: flex;
          flex-direction: column;
          width: 100%;
          max-width: 800px;
          max-height: 90vh;
          overflow: hidden;
          background: #fff;
          border-radius: 12px;
          font-family: Inter, sans-serif;
        }

        .add-edit-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          border-bottom: 1px solid #e5e5e5;
        }

        .add-edit-header h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 700;
          color: #0a0a0a;
        }

        .add-edit-icon-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          background: transparent;
          border: none;
          border-radius: 6px;
          color: #434547;
          cursor: pointer;
        }

        .add-edit-icon-btn:hover {
          background: #f0f1f3;
        }

        .add-edit-body {
          padding: 20px 24px;
          overflow-y: auto;
        }

        .add-edit-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .add-edit-field-full {
          grid-column: 1 / -1;
        }

        .add-edit-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .add-edit-field label {
          font-size: 13px;
          font-weight: 500;
          color: #343a46;
        }

        .required {
          color: #ef4444;
        }

        .add-edit-field input[type="text"],
        .add-edit-field input:not([type]),
        .add-edit-field textarea {
          padding: 8px 12px;
          font-size: 14px;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          outline: none;
          font-family: inherit;
        }

        .add-edit-field input.has-error,
        .add-edit-select-wrap.has-error select {
          border-color: #ef4444;
        }

        .error-text {
          margin: 0;
          font-size: 12px;
          color: #ef4444;
        }

        .add-edit-select-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .add-edit-select-wrap select {
          width: 100%;
          padding: 8px 32px 8px 12px;
          font-size: 14px;
          appearance: none;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          outline: none;
          background: #fff;
        }

        .add-edit-select-wrap :global(svg) {
          position: absolute;
          right: 10px;
          color: #737373;
          pointer-events: none;
        }

        .hidden-input {
          display: none;
        }

        .add-edit-file-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          font-size: 13px;
          color: #343a46;
          text-align: left;
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          cursor: pointer;
        }

        .add-edit-file-btn:hover {
          background: #f7f8fa;
        }

        .add-edit-footer {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          padding: 16px 24px;
          border-top: 1px solid #e5e5e5;
        }

        .btn-outline,
        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          font-size: 14px;
          font-weight: 500;
          border-radius: 8px;
          cursor: pointer;
        }

        .btn-outline {
          color: #343a46;
          background: #fff;
          border: 1px solid #e5e5e5;
        }

        .btn-outline:hover {
          background: #f7f8fa;
        }

        .btn-primary {
          color: #fff;
          background: #0588f0;
          border: none;
        }

        .btn-primary:hover {
          background: #0473cc;
        }

        .btn-outline:disabled,
        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spin {
          animation: add-edit-spin 0.8s linear infinite;
        }

        @keyframes add-edit-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 640px) {
          .add-edit-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AddEditDocument;