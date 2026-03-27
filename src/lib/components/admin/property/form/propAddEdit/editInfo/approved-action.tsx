"use client";

import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import { objToQueryString } from "@/lib/core/utils/app-func";
import { IPropResponse } from "@/lib/interfaces/Property/IProp";
import {
  EPropTransferStatus,
  EPropTransferType,
} from "@/services/property/models/prop-transfer";
import propTransferApi from "@/services/property/propTransferApi";

type Props = {
  model: IPropResponse;
};

const ApprovedAction = ({ model }: Props) => {
  const router = useRouter();

  const { data: countInSegment } = propTransferApi.useCount({
    PropId: model.Id,
    OldUserId: model.UserAdminId,
    Status: EPropTransferStatus.Pending,
    Type: EPropTransferType.InSegment,
  });

  const { data: countAboveSegment } = propTransferApi.useCount({
    PropId: model.Id,
    OldUserId: model.UserAdminId,
    Status: EPropTransferStatus.Pending,
    Type: EPropTransferType.AboveSegment,
  });
  const totalCount =
    (countInSegment?.data ?? 0) + (countAboveSegment?.data ?? 0);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" type="button">
          {totalCount > 0 && (
            <Badge
              className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
              variant="destructive"
            >
              {totalCount}
            </Badge>
          )}
          Phê duyệt
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => {
            router.push(
              `${AppRoutes.propTransfer.url}?${objToQueryString({
                PropId: model.Id,
                OldUserId: model.UserAdminId,
                Status: EPropTransferStatus.Pending,
                Type: EPropTransferType.InSegment,
              })}`
            );
          }}
        >
          Chuyển đổi người nhập SĐT{" "}
          {(countInSegment?.data ?? 0) > 0 && (
            <Badge
              className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
              variant="destructive"
            >
              {countInSegment?.data ?? 0}
            </Badge>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            router.push(
              `${AppRoutes.verifyProperty.url}?${objToQueryString({
                PropId: model.Id,
                OldUserId: model.UserAdminId,
                Status: EPropTransferStatus.Pending,
                Type: EPropTransferType.AboveSegment,
              })}`
            );
          }}
        >
          Kiểm duyệt Bất động sản
          {(countAboveSegment?.data ?? 0) > 0 && (
            <Badge
              className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
              variant="destructive"
            >
              {countAboveSegment?.data ?? 0}
            </Badge>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ApprovedAction;
