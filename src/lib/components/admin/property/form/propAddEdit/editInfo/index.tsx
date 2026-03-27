"use client";

import { History, Info } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { appConst } from "@/lib/core/configs/appConst";
import { IPropResponse } from "@/lib/interfaces/Property/IProp";
import HistoryModel from "../../../modal/historyModal";
import ApprovedAction from "./approved-action";

type Props = {
  model: IPropResponse;
};

const EditInfo = ({ model }: Props) => {
  const { data: session } = useSession();
  const [openHistory, setOpenHistory] = useState<boolean>(false);

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          Người nhập SĐT: {model.UserAdminName}
        </span>
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="text-muted-foreground cursor-help w-4 h-4" />
          </TooltipTrigger>
          <TooltipContent>
            <p>*Được phép ẩn số điện thoại liên hệ khi cần</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="text-sm text-muted-foreground">
        Cập nhật: {model.UpdatedBy}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => {
            setOpenHistory(true);
          }}
          type="button"
        >
          <History className="w-4 h-4" />
          Lịch sử
        </Button>

        {appConst.MANAGER_ROLES.includes(session?.user?.RoleId ?? 0) && (
          <ApprovedAction model={model} />
        )}
      </div>

      <HistoryModel
        model={model}
        isModalOpen={openHistory}
        handleCancel={() => {
          setOpenHistory(false);
        }}
      />
    </div>
  );
};

export default EditInfo;
