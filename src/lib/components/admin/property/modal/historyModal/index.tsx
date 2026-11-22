import { Modal as LucideModal } from "@/lib/components/antd-lucide";
import HistoryTree from "@/lib/components/shared/HistoryTree";
import styles from "@/lib/components/shared/HistoryTree/history.module.css";
import { FormatDate } from "@/lib/core/utils/myFormat";
import type { IPropResponse } from "@/lib/interfaces/Property/IProp";

type Props = {
  isModalOpen: boolean;
  model?: IPropResponse;
  handleCancel: () => void;
};

const HistoryModel = ({ isModalOpen, model, handleCancel }: Props) => (
  <LucideModal
    className={styles.dialog}
    title={
      <>
        LỊCH SỬ BẤT ĐỘNG SẢN
        {model && (
          <>
            <div className={styles.subtitle}>
              Mã BĐS: {model.Id}
              {model.PropAddress?.DisplayAddress && ` - Địa chỉ: ${model.PropAddress.DisplayAddress}`}
            </div>
            <div className={styles.metadata}>
              <div><span>Ngày nhập:</span>{FormatDate(model.CreatedDate).replaceAll("-", "/") || "—"}</div>
              <div><span>Người nhập:</span>{model.CreatedBy || "—"}</div>
            </div>
          </>
        )}
      </>
    }
    open={isModalOpen}
    width={768}
    style={{ top: 59 }}
    styles={{ mask: { background: "rgba(0,0,0,0.3)" } }}
    footer={null}
    onCancel={handleCancel}
  >
    {model && isModalOpen && <HistoryTree instanceId={model.Id} TableName="tblProp" />}
  </LucideModal>
);

export default HistoryModel;
