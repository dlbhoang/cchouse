import { AudioMutedOutlined, AudioOutlined } from "@ant-design/icons";
import { notification, Space } from "antd";
import { useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

interface SpeechToTextProps {
  onTranscriptChange: (text: string) => void;
  onListeningChange?: (isListening: boolean) => void;
}

export const SpeechToText = ({
  onTranscriptChange,
  onListeningChange,
}: SpeechToTextProps) => {
  const { transcript, listening, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      notification.error({
        message: "Ghi âm giọng nói không được hỗ trợ",
        description:
          "Trình duyệt của bạn không hỗ trợ ghi âm giọng nói. Vui lòng sử dụng trình duyệt khác.",
        placement: "topRight",
      });
    }
  }, [browserSupportsSpeechRecognition]);

  useEffect(() => {
    if (transcript) {
      console.log("transcript", transcript);
      onTranscriptChange(
        transcript
          .replace(/\s*(xẹt|xoẹt|xuyệt)\s*,?\s*/g, "/") // Thay thế tất cả cách đọc "xẹt"
          .replace(/\.$/, "") // Xóa dấu chấm ở cuối câu
      );
    }
  }, [transcript]);

  useEffect(() => {
    onListeningChange?.(listening);
  }, [listening, onListeningChange]);

  return listening ? (
    <AudioMutedOutlined
      style={{
        cursor: "pointer",
      }}
      onClick={SpeechRecognition.stopListening}
    />
  ) : (
    <Space>
      <AudioOutlined
        style={{
          color: "#1677ff",
          cursor: "pointer",
        }}
        onClick={() =>
          SpeechRecognition.startListening({
            language: "vi-VN",
          })
        }
      />
    </Space>
  );
};
