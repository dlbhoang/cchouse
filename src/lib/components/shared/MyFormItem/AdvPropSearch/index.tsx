import {
  Button,
  Dropdown,
  Form,
  type FormInstance,
  Input,
  Space,
  Tooltip,
} from "antd";
import { History, MapPin, RotateCcwIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { SpeechToText } from "@/lib/components/shared/SpeechToText";
import { CombineAddress } from "@/lib/core/utils/myFormat";
import { usePropStore } from "@/lib/stored";
import propertyApi from "@/services/api/property/propertyApi";

type Props = {
  form: FormInstance;
  placeholder: string;
  handleRefresh: () => void;
  onFocus?: () => void;
};

type SuggestItem = {
  key: number | string;
  label: string;
  onClick?: () => void;
};

export const AdvPropSearch = ({ form, placeholder, handleRefresh }: Props) => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [suggestItems, setSuggestItems] = useState<SuggestItem[]>([]);
  const [recentItems, setRecentItems] = useState<SuggestItem[]>([]);

  const searchWatch = Form.useWatch("search", form);
  const transTypeWatch = Form.useWatch("TransType", form);
  const statusWatch = Form.useWatch("Status", form);

  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const { recentData, onRecentDataChange } = usePropStore();

  const handleSelect = (e: any) => {
    form.setFieldValue(
      "search",
      `${e.PropAddress.AddressNumber} ${e.PropAddress.StreetName}`
    );
    onRecentDataChange(e);
    setOpenDropdown(false);
    form.submit();
  };

  const handleTypingTimeout = async (val?: string) => {
    setIsTyping(true);

    try {
      if (val) {
        const result = await propertyApi.get({
          pageIndex: 1,
          pageSize: 5,
          TransType: transTypeWatch,
          Status: statusWatch,
          search: val,
        });

        const resultItems: SuggestItem[] =
          result?.data?.length > 0
            ? result.data.map((e) => ({
                key: e.Id,
                label: CombineAddress(e.PropAddress),
                onClick: () => handleSelect(e),
              }))
            : [];

        setSuggestItems(resultItems);
      } else {
        setSuggestItems([]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => handleTypingTimeout(searchWatch), 1000);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchWatch]);

  useEffect(() => {
    const items: SuggestItem[] =
      recentData?.length > 0
        ? recentData.map((e) => ({
            key: e.Id,
            label: CombineAddress(e.PropAddress),
            onClick: () => handleSelect(e),
          }))
        : [];
    setRecentItems(items);
  }, [recentData]);

  const dropdownContent = (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 6px 24px rgba(0,0,0,0.12)",
        padding: "12px 0",
        width: "100%",
        minWidth: 600,
      }}
    >
      <div style={{ display: "flex", gap: 0 }}>
        {/* Cột trái: Xem gần đây */}
        <div style={{ flex: 1, padding: "0 16px", borderRight: "1px solid #f0f0f0" }}>
          <div style={{ color: "#a3a3a3", fontSize: 13, padding: "4px 8px", marginBottom: 4 }}>
            Xem gần đây
          </div>
          {recentItems.length === 0 ? (
            <div style={{ color: "#a3a3a3", fontSize: 13, padding: "6px 8px" }}>
              Trống
            </div>
          ) : (
            recentItems.map((item) => (
              <div
                key={item.key}
                onClick={item.onClick}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 8px",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontSize: 13,
                  color: "#404040",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f5f5")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <History size={14} color="#a3a3a3" />
                <span>{item.label}</span>
              </div>
            ))
          )}
        </div>

        {/* Cột phải: Gợi ý tìm kiếm */}
        <div style={{ flex: 1, padding: "0 16px" }}>
          <div style={{ color: "#a3a3a3", fontSize: 13, padding: "4px 8px", marginBottom: 4 }}>
            Gợi ý tìm kiếm
          </div>
          {suggestItems.length === 0 ? (
            <div style={{ color: "#a3a3a3", fontSize: 13, padding: "6px 8px" }}>
              {isTyping ? "Đang tìm..." : "Không tìm thấy dữ liệu"}
            </div>
          ) : (
            suggestItems.map((item) => (
              <div
                key={item.key}
                onClick={item.onClick}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 8px",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontSize: 13,
                  color: "#404040",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f5f5")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <MapPin size={14} color="#a3a3a3" />
                <span>{item.label}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Dòng chọn khu vực */}
      <div
        style={{
          borderTop: "1px solid #f0f0f0",
          marginTop: 8,
          padding: "8px 16px 0",
        }}
      >
        <Space
          style={{ cursor: "pointer", color: "#0588f0", fontSize: 13 }}
          onClick={() => {
            setOpenDropdown(false);
            // TODO: mở modal/chọn khu vực
          }}
        >
          <MapPin size={14} color="#0588f0" />
          <span>Chọn khu vực (thành phố, quận huyện, phường, xã...)</span>
        </Space>
      </div>
    </div>
  );

  return (
    <Dropdown
      open={openDropdown}
      onOpenChange={setOpenDropdown}
      trigger={["click"]}
      dropdownRender={() => dropdownContent}
      overlayStyle={{ width: 600 }}
    >
      <Form.Item name="search" noStyle>
        <Space.Compact style={{ width: "100%" }}>
          <Input
            placeholder={
              isListening ? ".....đang nhận diện giọng nói" : placeholder
            }
            value={searchWatch}
            onPressEnter={() => form.submit()}
            onFocus={() => setOpenDropdown(true)}
            onChange={(e) => form.setFieldValue("search", e.target.value)}
            prefix={
              <SpeechToText
                onTranscriptChange={(text) => {
                  form.setFieldValue("search", text);
                }}
                onListeningChange={setIsListening}
              />
            }
            className="adv-search-input"
            style={{ height: 40 }}
          />

          

          <style>{`
            .adv-search-input {
              border-radius: 10px !important;
            }

            .adv-search-input:hover,
            .adv-search-input:focus,
            .adv-search-input-focused {
              border-color: #0588f0 !important;
              box-shadow: none !important;
            }
          `}</style>
        </Space.Compact>
      </Form.Item>
    </Dropdown>
  );
};