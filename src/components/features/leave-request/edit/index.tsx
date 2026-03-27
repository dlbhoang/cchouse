"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { BriefcaseBusiness, Loader2, Phone, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { mutate } from "swr";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { leaveRequestRoutes } from "@/constants/routes/leave-request-routes";
import { useAdminContext } from "@/lib/stored";
import { axiosClient } from "@/services/api/api_config";
import MainForm from "../common/main-form";
import { type ILeaveRequest, LeaveRequestSchema } from "../types/leave-request";
import type { ILeaveResponse } from "../types/leave-response";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  item: ILeaveResponse;
};

const LeaveRequestEdit = ({ isOpen, onClose, item }: Props) => {
  const { data: session } = useSession();
  const { managers } = useAdminContext();
  const myManager = managers.find((m) => m.Id === session?.user?.ManagedBy);

  const form = useForm<ILeaveRequest>({
    resolver: zodResolver(LeaveRequestSchema),
    defaultValues: {
      StartDate: dayjs(item.StartDate).toDate(),
      EndDate: dayjs(item.EndDate).toDate(),
      RequestNotes: item.RequestNotes ?? "",
      Type: item.Type,
    },
    disabled: item.StatusName !== "Chờ duyệt",
  });

  const onSubmit = async (data: ILeaveRequest) => {
    try {
      await axiosClient.put(`${leaveRequestRoutes.base}/${item.Id}`, {
        ...data,
        Id: item.Id,
      });
      onClose();
      form.reset();
    } catch (error) {
      console.error(error);
    } finally {
      // Mutate all keys that start with leaveRequestRoutes.base
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
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xs sm:max-w-md overflow-y-auto max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex uppercase">
            <span>Chỉnh sửa đơn xin nghỉ</span>
          </DialogTitle>
          {/* <DialogDescription>
            Đơn xin nghỉ sẽ được gửi đến quản lý / bộ phân liên quan để kiểm duyệt.
          </DialogDescription> */}
        </DialogHeader>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                Nhân viên:
              </span>
            </div>
            <span className="font-medium">
              {session?.user?.Name || "Không xác định"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BriefcaseBusiness className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                Chức vụ:
              </span>
            </div>
            <span className="font-medium">
              {session?.user.RoleName || "Không xác định"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                Số điện thoại:
              </span>
            </div>
            <span className="font-medium">
              {session?.user.Phone || "Không xác định"}
            </span>
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
            id="leave-request-form"
          >
            <MainForm form={form} />
          </form>
        </Form>
        <div className="space-y-3 p-4 bg-muted rounded-md">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                Quản lý / Người kiểm duyệt:
              </span>
            </div>
            <span className="font-medium">
              {myManager?.Name || "Không xác định"}
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <BriefcaseBusiness className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                Chức vụ:
              </span>
            </div>
            <span className="font-medium">
              {myManager?.RoleName || "Không xác định"}
            </span>
          </div>
          <ul className="list-disc list-inside text-sm">
            <li>
              Thời gian quản lý kiểm duyệt yêu cầu xin nghỉ phép tối đa 06 (sáu)
              tiếng trong giờ làm việc; ngoài giờ làm việc nhân sự vui lòng liên
              hệ trực tiếp quản lý.
            </li>
            <li>
              Trường hợp từ chối yêu cầu xin nghỉ phép: quản lý nêu lý do cụ
              thể.
            </li>
          </ul>
        </div>
        <DialogFooter>
          <Button
            className="h-8"
            variant="outline"
            type="button"
            onClick={onClose}
          >
            Hủy
          </Button>
          <Button
            className="h-8"
            type="submit"
            form="leave-request-form"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting && (
              <Loader2 className="animate-spin" />
            )}
            Cập nhật
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveRequestEdit;
