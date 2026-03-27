import { Input, message } from "antd";
import { useState } from "react";
import { mutate } from "swr";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { leaveRequestRoutes } from "@/constants/routes/leave-request-routes";
import { axiosClient } from "@/services/api/api_config";
import { ELeaveRequestStatus } from "./types/enum";

const RejectModal = ({
  id,
  onSuccess,
  disabled,
}: {
  id: number;
  onSuccess?: () => void;
  disabled?: boolean;
}) => {
  const [rejectionReason, setRejectionReason] = useState("");

  const handleReject = async () => {
    if (!rejectionReason) {
      message.error("Vui lòng nhập lý do từ chối");
      return;
    }
    await axiosClient.put(leaveRequestRoutes.approve(id), {
      Id: id,
      Status: ELeaveRequestStatus.Rejected,
      Note: rejectionReason,
    });

    mutate((key) => {
      if (Array.isArray(key) && key[0] === leaveRequestRoutes.base) return true;
      if (typeof key === "string" && key.startsWith(leaveRequestRoutes.base))
        return true;
      return false;
    });
    mutate((key) => {
      if (Array.isArray(key) && key[0] === leaveRequestRoutes.count)
        return true;
      if (typeof key === "string" && key.startsWith(leaveRequestRoutes.count))
        return true;
      return false;
    });
    onSuccess?.();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          className="text-white h-8"
          disabled={disabled}
        >
          Từ chối
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Từ chối yêu cầu nghỉ phép</AlertDialogTitle>
          <AlertDialogDescription>
            Vui lòng nhập lý do từ chối yêu cầu nghỉ phép.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4">
          <Input.TextArea
            id="rejection-reason"
            placeholder="Nhập lý do từ chối..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            className="mt-2"
            rows={4}
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleReject}
            disabled={!rejectionReason}
            className="bg-green-600 hover:bg-green-700"
          >
            Xác nhận
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RejectModal;
