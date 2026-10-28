import { Modal as LucideModal } from "@/lib/components/antd-lucide";
import {Button, Space, Divider, Typography} from "antd";
import { Eye, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import { FormatDateTime } from "@/lib/core/utils/myFormat";
import type { INewsResponse } from "@/services/api/news/INews";

type Props = {
  isModalOpen: boolean;
  hiddenEdit?: boolean;
  model: INewsResponse;
  handleCancel: () => void;
  onEdit?: (item: INewsResponse) => void;
};

const NewPreview = ({
  isModalOpen,
  hiddenEdit,
  model,
  handleCancel,
  onEdit,
}: Props) => {
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement>(null);
  const articleContent = (model.Content || "<p>Không có nội dung</p>")
    // Imported articles often begin with empty editor paragraphs; those create the visible blank band in the preview.
    .replace(/^(?:\s*<(?:p|div)(?:\s[^>]*)?>\s*(?:<br\s*\/?\s*>|&nbsp;|&#160;|\s)*<\/(?:p|div)>\s*)+/i, "");

  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    // Imported publisher markup includes audio players, navigation and ad slots that render as large blank gaps in the admin preview.
    container.querySelectorAll(".af-tts, .knc-menu-nav").forEach((element) => element.remove());
    while (container.firstChild?.nodeType === Node.TEXT_NODE && !container.firstChild.textContent?.trim()) {
      container.firstChild.remove();
    }
    while (container.firstElementChild && /^(P|DIV)$/.test(container.firstElementChild.tagName)) {
      const first = container.firstElementChild;
      const hasVisibleContent = Boolean(first.textContent?.replace(/\u00a0/g, " ").trim()) || first.querySelector("img,video,iframe,table,hr");
      if (hasVisibleContent) break;
      first.remove();
    }

    const thumbnail = Array.isArray(model.Thumbnail) ? model.Thumbnail[0] : model.Thumbnail;
    const thumbnailSrc = thumbnail && typeof thumbnail === "object"
      ? String(thumbnail.url ?? thumbnail.Path ?? thumbnail.path ?? "")
      : String(thumbnail ?? "").split("|")[0].trim();

    // Chuẩn hóa: bỏ domain, query string, decode, lowercase, bỏ đuôi mở rộng
    const normalize = (url?: string) => {
      if (!url) return "";
      try {
        let clean = decodeURIComponent(url.split("?")[0]);
        clean = clean.substring(clean.lastIndexOf("/") + 1);
        clean = clean.replace(/\.[a-zA-Z0-9]+$/, ""); // bỏ đuôi .jpg/.png...
        return clean.toLowerCase().trim();
      } catch {
        return url.toLowerCase();
      }
    };

    const thumbnailKey = normalize(thumbnailSrc);

    const isSameImage = (a: string, b: string) => {
      if (!a || !b) return false;
      if (a === b) return true;
      // so khớp lỏng: 1 chuỗi chứa chuỗi kia (phòng khi có hash/prefix khác nhau)
      return a.length > 5 && b.length > 5 && (a.includes(b) || b.includes(a));
    };

    const imgs = container.querySelectorAll("img");

    imgs.forEach((img) => {
      const imgSrc = img.getAttribute("src") || img.src;
      const imgKey = normalize(imgSrc);

      const matchesThumbnail = thumbnailKey && isSameImage(imgKey, thumbnailKey);
      const titleKey = (model.Title || "").trim().toLocaleLowerCase();
      const imageTitle = (img.getAttribute("alt") || img.getAttribute("title") || "").trim().toLocaleLowerCase();
      const matchesArticleCover = Boolean(titleKey && imageTitle === titleKey);

      if (matchesThumbnail || matchesArticleCover) {
        img.style.display = "none";
        return;
      }

      const hideIfBroken = () => {
        if (img.complete && img.naturalWidth === 0) {
          img.style.display = "none";
        }
      };
      img.addEventListener("error", () => {
        img.style.display = "none";
      });
      hideIfBroken();
    });
  }, [model.Content, model.Thumbnail, isModalOpen]);

  const handleEdit = () => {
    handleCancel();
    if (onEdit) {
      onEdit(model);
      return;
    }
    router.push(`${AppRoutes.news.url}/edit/${model.Id}`);
  };

  const labelStyle: React.CSSProperties = {
    color: "var(--Text-Main, #0A0A0A)",
    fontFamily: "var(--Font-family-Text, Inter)",
    fontSize: "var(--Font-sizes-text-xs, 12px)",
    fontStyle: "normal",
    fontWeight: 500,
    lineHeight: "var(--Line-height-text-xs, 16px)",
  };

  const valueStyle: React.CSSProperties = {
    color: "var(--Text-Subtle, #A1A1AA)",
    fontFamily: "var(--Font-family-Text, Inter)",
    fontSize: "var(--Font-sizes-text-xs, 12px)",
    fontStyle: "normal",
    fontWeight: 500,
    lineHeight: "var(--Line-height-text-xs, 16px)",
  };

  const closeButtonStyle: React.CSSProperties = {
    display: "flex",
    padding: "8px 16px",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    borderRadius: 10,
    border: "1px solid var(--Text-Border, #E5E5E5)",
    background: "var(--Text-White, #FFF)",
    height: "auto",
  };

  const editButtonStyle: React.CSSProperties = {
    display: "flex",
    padding: "8px 16px",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    borderRadius: 10,
    background: "var(--Brand-Main, #0588F0)",
    border: "none",
    height: "auto",
  };

  return (
    <LucideModal
      open={isModalOpen}
      width={1152}
      className="news-preview-modal"
      closeIcon={<X size={24} />}
      onCancel={handleCancel}
      title={
        <Typography.Title
          level={4}
          style={{
            margin: 0,
            fontSize: 16,
            fontWeight: 700,
            lineHeight: "28px",
          }}
        >
          CHI TIẾT BÀI VIẾT
        </Typography.Title>
      }
      centered
      footer={
        <Space>
          <Button onClick={handleCancel} style={closeButtonStyle}>
            Đóng
          </Button>
          {!hiddenEdit && (
            <Button onClick={handleEdit} type="primary" style={editButtonStyle}>
              Chỉnh sửa
            </Button>
          )}
        </Space>
      }
    >
      <div className="news-preview-body">
        <div
          style={{
            marginBottom: 24,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 8,
            alignSelf: "stretch",
          }}
        >
          <Typography.Title
            level={3}
            style={{
              margin: 0,
              color: "var(--Text-Main, #0A0A0A)",
              fontFamily: "var(--Font-family-Text, Inter)",
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "24px",
            }}
          >
            {model.Title || "Xem tin"}
          </Typography.Title>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Typography.Text style={valueStyle}>
              {FormatDateTime(model.CreatedDate)}
            </Typography.Text>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Typography.Text style={valueStyle}>
                {model.ViewCount ?? 0}
              </Typography.Text>
              <Eye size={16} />
            </div>
          </div>
          {model.CreatedBy ? (
            <Typography.Text>
              <span style={valueStyle}>
                Người đăng:
              </span>{" "}
              <span style={labelStyle}>{model.CreatedBy}</span>
            </Typography.Text>
          ) : null}
        </div>

        <div
          ref={contentRef}
          className="news-preview-content"
          dangerouslySetInnerHTML={{
            __html: articleContent || "<p>Không có nội dung</p>",
          }}
        />

        {model.Source?.trim() ? (
          <div
            style={{
              marginTop: 12,
              paddingTop: 12,
              borderTop: "1px solid var(--Text-Border, #E5E5E5)",
            }}
          >
            <Typography.Text>
              <span style={{ ...labelStyle, fontWeight: 700 }}>Nguồn:</span>{" "}
              {/^https?:\/\//i.test(model.Source) ? (
                <a
                  href={model.Source}
                  target="_blank"
                  rel="noreferrer noopener"
                  style={{ color: "var(--Brand-Main, #0588F0)" }}
                >
                  {model.Source}
                </a>
              ) : (
                <span style={valueStyle}>{model.Source}</span>
              )}
            </Typography.Text>
          </div>
        ) : null}
      </div>
    </LucideModal>
  );
};

export default NewPreview;
