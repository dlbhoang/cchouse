"use client";
import {
  AlertCircle,
  Calendar,
  Calendar1,
  Check,
  FileText,
  User,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { mutate } from "swr";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { leaveRequestRoutes } from "@/constants/routes/leave-request-routes";
import { FormatDate, FormatDateTime } from "@/lib/core/utils/myFormat";
import { useAdminContext } from "@/lib/stored";
import { calculateDuration } from "@/lib/utils";
import { axiosClient } from "@/services/api/api_config";
import RejectModal from "./reject-modal";
import { ELeaveRequestStatus } from "./types/enum";
import type { ILeaveResponse } from "./types/leave-response";

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ILeaveResponse;
}

interface StatusAlertProps {
  statusName: string;
  item: ILeaveResponse;
}

interface BasicInfoCardProps {
  item: ILeaveResponse;
}

function BasicInfoCard({ item }: BasicInfoCardProps) {
  const getStatusBadgeVariant = (statusName: string) => {
    switch (statusName?.toLowerCase()) {
      case "đã duyệt":
        return "default";
      case "từ chối":
        return "destructive";
      case "chờ duyệt":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="h-5 w-5" />
          Thông tin cơ bản
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            Trạng thái:
          </span>
          <Badge variant={getStatusBadgeVariant(item.StatusName || "")}>
            {item.StatusName || "Không xác định"}
          </Badge>
        </div>

        {/* Employee Information */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                Nhân viên:
              </span>
            </div>
            <span className="font-medium">
              {item.UserRequestName || "Không xác định"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar1 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                Ngày tạo:
              </span>
            </div>
            <span className="font-medium">
              {item.CreatedDate
                ? FormatDateTime(item.CreatedDate.toString())
                : "Không xác định"}
            </span>
          </div>

          {/* Leave Type */}
          {/* <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                Loại nghỉ phép:
              </span>
            </div>
            <span className="font-medium">
              {item.TypeName || 'Không xác định'}
            </span>
          </div> */}
        </div>

        {/* Date Range */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">
              Thời gian nghỉ:
            </span>
          </div>
          <div className="ml-6 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Từ ngày:</span>
              <span className="font-medium">
                {item.StartDate
                  ? FormatDate(item.StartDate.toString())
                  : "Không xác định"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Đến hết ngày:</span>
              <span className="font-medium">
                {item.EndDate
                  ? FormatDate(item.EndDate.toString())
                  : "Không xác định"}
              </span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-sm font-medium">Số ngày nghỉ:</span>
              <span className="font-medium text-blue-600">
                {item.StartDate && item.EndDate
                  ? `${calculateDuration(item.StartDate, item.EndDate)} ngày`
                  : "Không xác định"}
              </span>
            </div>
          </div>
        </div>

        {/* Request Notes */}
        {item.RequestNotes && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                Lý do nghỉ phép:
              </span>
            </div>
            <div className="ml-6 rounded-md bg-muted p-3">
              <p className="text-sm">{item.RequestNotes}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StatusAlert({ statusName, item }: StatusAlertProps) {
  const { managers } = useAdminContext();
  const manager = managers.find((m) => m.Id === item.UserApprovedId);

  if (!statusName) return null;

  if (statusName === "đã duyệt") {
    return (
      <Alert className="border-green-200 bg-green-50">
        <Check className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          Đã phê duyệt thành công yêu cầu nghỉ phép của{" "}
          <strong>{item.UserRequestName}</strong>
          <span className="block">
            Người phê duyệt:{" "}
            <strong>
              {item.UserApprovedName} ({manager?.RoleName})
            </strong>
          </span>
        </AlertDescription>
      </Alert>
    );
  }

  if (statusName === "từ chối") {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertCircle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          Đã từ chối yêu cầu nghỉ phép của{" "}
          <strong>{item.UserRequestName}</strong>
          <span className="block">
            Lý do: <strong>{item.ApprovedNotes}</strong>
          </span>
          <span className="block">
            Người từ chối:{" "}
            <strong>
              {item.UserApprovedName} ({manager?.RoleName})
            </strong>
          </span>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}

// Main component
function DetailModal({ isOpen, onClose, item }: DetailModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = useSession();
  const isAdminOrMod = [1, 2].includes(session?.user?.RoleId ?? 0);

  const onApprove = async () => {
    try {
      setIsSubmitting(true);
      if (!item.Id) return;

      await axiosClient.put(leaveRequestRoutes.approve(item.Id), {
        Id: item.Id,
        Status: ELeaveRequestStatus.Approved,
      });
      // mutate(propTransferApi.mutateKey);
      mutate((key) => {
        if (Array.isArray(key) && key[0] === leaveRequestRoutes.base)
          return true;
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

      onClose();
    } catch (error) {
      console.error("Error approving property:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex uppercase">
            Đơn xin nghỉ phép
          </DialogTitle>
          <DialogDescription>Kiểm duyệt lại thông tin</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <BasicInfoCard item={item} />
        </div>
        <StatusAlert
          statusName={item.StatusName?.toLowerCase() ?? ""}
          item={item}
        />
        {isAdminOrMod && item.StatusName?.toLowerCase() === "chờ duyệt" && (
          <>
            <DialogFooter className="flex gap-2">
              {item.Id && (
                <RejectModal
                  id={item.Id}
                  onSuccess={onClose}
                  disabled={isSubmitting}
                />
              )}
              <Button
                className="h-8"
                variant="outline"
                onClick={onApprove}
                disabled={isSubmitting}
              >
                Phê duyệt
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default DetailModal;
