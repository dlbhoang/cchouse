import { Modal as LucideModal } from "@/lib/components/antd-lucide";
import {Result as LucideResult } from "@/lib/components/antd-lucide";

import {Modal} from "antd";
import dayjs from "dayjs";
import { CakeIcon, Gift } from "lucide-react";
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
    <LucideModal
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
      <LucideResult
        icon={<Gift size={72} />}
        title={
          <span>
            "Thật tuyệt, hôm nay là sinh nhật bạn. Chúc bạn có một ngày tuyệt
            vời!"
            <CakeIcon size={35} />
          </span>
        }
      />
    </LucideModal>
  );
};

export default HappyBirthdayModal;
