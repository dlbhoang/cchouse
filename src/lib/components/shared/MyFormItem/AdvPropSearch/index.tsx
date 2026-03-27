import {
  Button,
  Dropdown,
  Form,
  type FormInstance,
  Input,
  type MenuProps,
  Space,
  Tooltip,
} from "antd";
import { RotateCcwIcon, SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { SpeechToText } from "@/lib/components/shared/SpeechToText";
import { CombineAddress } from "@/lib/core/utils/myFormat";
import { usePropStore } from "@/lib/stored";
import propertyApi from "@/services/api/property/propertyApi";

const { Search } = Input;

type Props = {
  form: FormInstance;
  placeholder: string;
  handleRefresh: () => void;
  onFocus?: () => void;
};

const emptyItem = {
  key: -1,
  label: "Trống",
  disabled: true,
};

const notFoundItem = {
  key: 0,
  label: "Không tìm thấy dữ liệu",
  disabled: true,
};

export const AdvPropSearch = ({ form, placeholder, handleRefresh }: Props) => {
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const [items, setItems] = useState<MenuProps["items"]>([emptyItem]);
  const searchWatch = Form.useWatch("search", form);
  const transTypeWatch = Form.useWatch("TransType", form);
  const statusWatch = Form.useWatch("Status", form);
  const [isTyping, setIsTyping] = useState(false);
  const { recentData, onRecentDataChange } = usePropStore();
  const [isListening, setIsListening] = useState(false);

  const handleTypingTimeout = async (val?: string) => {
    // Your action when the user stops typing
    // setOpenDropdown(true);
    setIsTyping(true);
    if (val) {
      const result = await propertyApi.get({
        pageIndex: 1,
        pageSize: 3,
        TransType: transTypeWatch,
        Status: statusWatch,
        search: val,
      });

      const resultItems: MenuProps["items"] =
        result?.data.length > 0
          ? result?.data.map((e) => ({
              key: e.Id,
              label: CombineAddress(e.PropAddress),
              onClick: (f) => {
                form.setFieldValue(
                  "search",
                  `${e.PropAddress.AddressNumber} ${e.PropAddress.StreetName}`
                );
                // form.setFieldValue('PropertyId', e.Id);
                onRecentDataChange(e);
                form.submit();
              },
            }))
          : [notFoundItem];
      setItems([
        {
          type: "group",
          key: "suggest",
          label: "Gợi ý tìm kiếm",
          children: resultItems,
        },
        {
          type: "group",
          key: "recent",
          label: "Xem gần đây",
          children:
            recentData?.length > 0
              ? recentData?.map((e) => ({
                  key: e.Id,
                  label: CombineAddress(e.PropAddress),
                  onClick: (f) => {
                    // form.setFieldValue('PropertyId', e.Id);
                    form.setFieldValue(
                      "search",
                      `${e.PropAddress.AddressNumber} ${e.PropAddress.StreetName}`
                    );
                    form.submit();
                  },
                }))
              : [emptyItem],
        },
      ]);
    } else {
      setItems([emptyItem]);
    }
    setIsTyping(false);
  };

  useEffect(() => {
    const timeoutId = setTimeout(
      async () => handleTypingTimeout(searchWatch),
      1000
    );
    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchWatch]);

  return (
    <Dropdown
      menu={{ items }}
      open={openDropdown}
      onOpenChange={setOpenDropdown}
      trigger={["click"]}
    >
      <Form.Item name="search">
        <Space.Compact direction="horizontal" style={{ width: "100%" }}>
          <Search
            placeholder={
              isListening ? ".....đang nhận diện giọng nói" : placeholder
            }
            onSearch={() => {
              form.submit();
            }}
            value={searchWatch}
            enterButton={
              <Button
                loading={isTyping}
                style={{ backgroundColor: "orange" }}
                icon={<SearchIcon className="size-4" />}
              />
            }
            prefix={
              <SpeechToText
                onTranscriptChange={(text) => {
                  form.setFieldValue("search", text);
                }}
                onListeningChange={setIsListening}
              />
            }
          />
          <Tooltip title="Đặt lại">
            <Button
              type="primary"
              icon={<RotateCcwIcon className="size-4" />}
              onClick={handleRefresh}
            />
          </Tooltip>
        </Space.Compact>
      </Form.Item>
    </Dropdown>
  );
};
