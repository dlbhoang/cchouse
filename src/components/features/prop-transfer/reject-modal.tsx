import { Input, message } from "antd";
import { useState } from "react";
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
import { EPropTransferStatus } from "@/services/property/models/prop-transfer";
import propTransferApi from "@/services/property/propTransferApi";

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
    await propTransferApi.approve({
      Id: id,
      Status: EPropTransferStatus.Rejected,
      Notes: rejectionReason,
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
          <AlertDialogTitle>Từ chối yêu cầu</AlertDialogTitle>
          <AlertDialogDescription>
            Vui lòng nhập lý do từ chối yêu cầu thay đổi người nhập BĐS.
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
