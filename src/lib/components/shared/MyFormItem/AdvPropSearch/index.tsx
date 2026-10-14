import {
  Button,
  Dropdown,
  Form,
  type FormInstance,
  Input,
  Space,
  Tooltip,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { History, MapPin, RotateCcwIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { SpeechToText } from "@/lib/components/shared/SpeechToText";
import AreaSelector, { type AreaSelection } from "@/lib/components/shared/AreaSelector";
import "./adv-prop-search.css";
import { CombineAddress } from "@/lib/core/utils/myFormat";
import { usePropStore } from "@/lib/stored";
import propertyApi from "@/services/api/property/propertyApi";

type Props = {
  form: FormInstance;
  placeholder: string;
  handleRefresh: () => void;
  onFocus?: () => void;
  showVoice?: boolean;
};

type SuggestItem = {
  key: number | string;
  label: string;
  onClick?: () => void;
};

export const AdvPropSearch = ({
  form,
  placeholder,
  handleRefresh,
  showVoice = true,
}: Props) => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [suggestItems, setSuggestItems] = useState<SuggestItem[]>([]);
  const [recentItems, setRecentItems] = useState<SuggestItem[]>([]);
  const [areaSelectorOpen, setAreaSelectorOpen] = useState(false);

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

  const handleAreaApply = (selection: AreaSelection) => {
    const address = [
      selection.houseNumber,
      selection.street,
      selection.ward,
      selection.district,
      selection.province,
    ]
      .filter(Boolean)
      .join(", ");

    form.setFieldValue("search", address);
    setAreaSelectorOpen(false);
    setOpenDropdown(false);
    form.submit();
  };

  const dropdownContent = areaSelectorOpen ? (
    <AreaSelector onApply={handleAreaApply} />
  ) : (
    <div
      className="adv-prop-search-dropdown-panel"
    >
      <div className="adv-prop-search-dropdown-body">
        {/* Cột trái: Gợi ý tìm kiếm */}
        <div className="adv-prop-search-column">
          <div className="adv-prop-search-column-title">
            Gợi ý tìm kiếm
          </div>
          {suggestItems.length === 0 ? (
            <div className="adv-prop-search-empty">
              {isTyping ? "Đang tìm..." : !searchWatch ? "Trống" : "Không tìm thấy dữ liệu"}
            </div>
          ) : (
            suggestItems.slice(0, 5).map((item) => (
              <div
                key={item.key}
                onClick={item.onClick}
                className="adv-prop-search-option"
              >
                <MapPin size={16} aria-hidden="true" />
                <span className="adv-prop-search-option-label">{item.label}</span>
              </div>
            ))
          )}
        </div>

        {/* Cột phải: Xem gần đây */}
        <div className="adv-prop-search-column">
          <div className="adv-prop-search-column-title">
            Xem gần đây
          </div>
          {recentItems.length === 0 ? (
            <div className="adv-prop-search-empty">
              Trống
            </div>
          ) : (
            recentItems.slice(0, 4).map((item) => (
              <div
                key={item.key}
                onClick={item.onClick}
                className="adv-prop-search-option"
              >
                <History size={16} aria-hidden="true" />
                <span className="adv-prop-search-option-label">{item.label}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Dòng chọn khu vực */}
      <div
        className="adv-prop-search-dropdown-bottom"
      >
        <Space
          className="adv-prop-search-area-action"
          onClick={() => {
            setAreaSelectorOpen(true);
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
      onOpenChange={(nextOpen) => {
        setOpenDropdown(nextOpen);
        if (!nextOpen) setAreaSelectorOpen(false);
      }}
      trigger={["click"]}
      overlayClassName="adv-prop-search-dropdown"
      dropdownRender={() => dropdownContent}
      overlayStyle={{
        width: areaSelectorOpen ? 384 : "min(760px, calc(100vw - 32px))",
      }}
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
              showVoice ? (
                <SpeechToText
                  onTranscriptChange={(text) => {
                    form.setFieldValue("search", text);
                  }}
                  onListeningChange={setIsListening}
                />
              ) : (
                <SearchOutlined />
              )
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
              border: none !important;
              box-shadow: none !important;
            }
          `}</style>
        </Space.Compact>
      </Form.Item>
    </Dropdown>
  );
};
