import { GiftTwoTone } from "@ant-design/icons";
import { Modal, Result } from "antd";
import dayjs from "dayjs";
import { CakeIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { appConst } from "@/lib/core/configs/appConst";
import { usePropStore } from "@/lib/stored";

const HappyBirthdayModal = () => {
  const { visibleBirthday, hiddenHappyBirthdayModal } = usePropStore();
  const { data: session } = useSession();
  const currentTimestamp = dayjs();

  if (session?.user) {
    const birthDay = dayjs(session.user.DateOfBirth).format(
      appConst.DAY_MONTH_FORMAT
    );
    const currentDayAndMonth = currentTimestamp.format(
      appConst.DAY_MONTH_FORMAT
    );
    if (birthDay !== currentDayAndMonth && visibleBirthday) {
      hiddenHappyBirthdayModal();
    }
  }

  return (
    <Modal
      open={visibleBirthday}
      onOk={() => {
        hiddenHappyBirthdayModal();
      }}
      onCancel={() => {
        hiddenHappyBirthdayModal();
      }}
      footer=""
      style={{ padding: 0 }}
    >
      <Result
        icon={<GiftTwoTone />}
        title={
          <span>
            "Thật tuyệt, hôm nay là sinh nhật bạn. Chúc bạn có một ngày tuyệt
            vời!"
            <CakeIcon size={35} />
          </span>
        }
      />
    </Modal>
  );
};

export default HappyBirthdayModal;
