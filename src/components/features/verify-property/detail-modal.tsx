"use client";
import {
  AlertCircle,
  Banknote,
  Check,
  ExternalLink,
  Home,
  MapPin,
  Phone,
  SquareDashed,
  StickyNote,
  User,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { mutate } from "swr";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import { ETransType } from "@/lib/core/enum";
import type { IPropResponse } from "@/lib/interfaces/Property/IProp";
import { useAdminContext } from "@/lib/stored";
import propertyApi from "@/services/api/property/propertyApi";
import {
  EPropTransferStatus,
  type IPropTransferResponse,
} from "@/services/property/models/prop-transfer";
import propTransferApi from "@/services/property/propTransferApi";
import RejectModal from "../prop-transfer/reject-modal";

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  transferData: IPropTransferResponse;
}

interface PropertyInfoCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number | null | undefined;
  fallback?: string;
}

interface StatusAlertProps {
  status: EPropTransferStatus | undefined;
  transferData: IPropTransferResponse;
}

// Sub-components
function PropertyInfoCard({
  title,
  description,
  children,
}: PropertyInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

function InfoItem({
  icon,
  label,
  value,
  fallback = "Không có dữ liệu",
}: InfoItemProps) {
  const displayValue = value || fallback;

  return (
    <div className="flex items-start gap-2">
      {icon}
      <div>
        <Label className="text-sm font-medium text-muted-foreground">
          {label}
        </Label>
        <p className="font-medium">{displayValue}</p>
      </div>
    </div>
  );
}

function StatusAlert({ status, transferData }: StatusAlertProps) {
  if (!status) return null;

  if (status === EPropTransferStatus.Approved) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <Check className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          Đã phê duyệt thành công yêu cầu cập nhật thông tin BĐS. Quyền sở hữu
          đã được chuyển cho <strong>{transferData.NewdUserName}</strong>
          <span className="block">
            Người phê duyệt: <strong>{transferData.ApproveUserName}</strong>
          </span>
        </AlertDescription>
      </Alert>
    );
  }

  if (status === EPropTransferStatus.Rejected) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertCircle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          Đã từ chối yêu cầu cập nhật thông tin BĐS.
          <span className="block">
            Lý do: <strong>{transferData.ApproveNotes}</strong>
          </span>
          <span className="block">
            Người từ chối: <strong>{transferData.ApproveUserName}</strong>
          </span>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}

function PendingWarningAlert({
  transferData,
}: {
  transferData: IPropTransferResponse;
}) {
  return (
    <Alert className="border-amber-200 bg-amber-50">
      <AlertCircle className="h-4 w-4 text-amber-500" />
      <AlertDescription className="text-amber-800">
        <strong>Lưu ý:</strong>
        <span>
          Việc xác thực phê duyệt sẽ cập nhật thông tin BĐS cũng sẽ chuyển đổi
          người sở hữu/người nhập BĐS này cho{" "}
          <strong>{transferData.NewdUserName}</strong>
        </span>
      </AlertDescription>
    </Alert>
  );
}

function BasicInfoCard({
  transferData,
  oldProperty,
  isLoading,
}: {
  transferData: IPropTransferResponse;
  oldProperty: IPropResponse | null;
  isLoading: boolean;
}) {
  const formatTransType = (transType: number) => {
    return transType === ETransType.sell
      ? "Mua bán"
      : transType === ETransType.rent
      ? "Cho thuê"
      : "Không xác định";
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="text-center py-8">Đang tải...</CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="h-5 w-5" />
          Thông tin cơ bản - Mã BĐS: {transferData.PropId}
          <Link
            href={`${AppRoutes.property.url}/${transferData.PropId}`}
            target="_blank"
          >
            <ExternalLink className="h-4 w-4 hover:text-primary" />
          </Link>
        </CardTitle>
        <CardDescription>Thông tin chung về bất động sản</CardDescription>
        <CardAction></CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <User className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Người nhập
              </Label>
              <p className="font-medium">{transferData.OlddUserName}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Home className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Loại giao dịch
              </p>
              <p className="font-medium">
                {formatTransType(oldProperty?.TransType || 0)}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 col-span-2">
            <SquareDashed className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Diện tích
              </p>
              <p className="font-medium">
                {oldProperty?.Area} m²
                {oldProperty?.Length &&
                  oldProperty?.Width &&
                  ` (${oldProperty?.Length}m × ${oldProperty?.Width}m)`}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 col-span-full">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Địa chỉ
              </p>
              <p className="font-medium">
                {oldProperty?.PropAddress.DisplayAddress}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PropertyComparisonCards({
  transferData,
  oldProperty,
  isLoading,
  PaymentMethod,
}: {
  transferData: IPropTransferResponse;
  oldProperty: IPropResponse | null;
  isLoading: boolean;
  PaymentMethod: any[];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Old Property Card */}
      <PropertyInfoCard
        title="Thông tin chủ cũ"
        description="Thông tin bất động sản hiện tại trong hệ thống"
      >
        {isLoading ? (
          <div className="text-center py-8">Đang tải...</div>
        ) : oldProperty ? (
          <div className="space-y-3">
            <InfoItem
              icon={
                <User className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              }
              label="Tên liên hệ"
              value={oldProperty.CustomerName}
            />
            <InfoItem
              icon={
                <Phone className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              }
              label="Số điện thoại"
              value={oldProperty.CustomerPhone.join(", ")}
            />
            <InfoItem
              icon={
                <Banknote className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              }
              label="Giá"
              value={oldProperty.DisplayPrice}
            />
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Không tìm thấy thông tin
          </div>
        )}
      </PropertyInfoCard>

      {/* New Property Card */}
      <PropertyInfoCard
        title="Thông tin chủ mới"
        description="Thông tin bất động sản được yêu cầu cập nhật"
      >
        <div className="space-y-3">
          <InfoItem
            icon={
              <User className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            }
            label="Tên liên hệ"
            value={transferData.CustomerName}
          />
          <InfoItem
            icon={
              <Phone className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            }
            label="Số điện thoại"
            value={transferData.CustomerPhone}
          />
          <InfoItem
            icon={
              <Banknote className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            }
            label="Giá"
            value={`${transferData.Price} ${
              PaymentMethod.find(
                (item) => item.Value === transferData.PaymentMethod
              )?.Name || ""
            }`}
          />
          <InfoItem
            icon={
              <StickyNote className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            }
            label="Mô tả yêu cầu"
            value={transferData.RequestNotes}
          />
        </div>
      </PropertyInfoCard>
    </div>
  );
}

// Main component
function DetailModal({ isOpen, onClose, transferData }: DetailModalProps) {
  const { enumList } = useAdminContext();
  const { PaymentMethod } = enumList;
  const [oldProperty, setOldProperty] = useState<IPropResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && transferData.PropId) {
      setIsLoading(true);
      propertyApi
        .getById(transferData.PropId)
        .then((response) => {
          setOldProperty(response.data);
        })
        .catch((error) => {
          console.error("Error fetching property:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isOpen, transferData.PropId]);

  const onApprove = async () => {
    try {
      setIsSubmitting(true);
      await propTransferApi.approve({
        Id: transferData.Id,
        Status: EPropTransferStatus.Approved,
      });
      mutate(propTransferApi.mutateKey);
      onClose();
    } catch (error) {
      console.error("Error approving property:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex uppercase">
            <span>Yêu cầu cập nhật thông tin</span>
          </DialogTitle>
          <DialogDescription>
            Thông tin này được yêu cầu từ việc xem dữ liệu không nằm trong phân
            khúc
          </DialogDescription>
        </DialogHeader>

        <StatusAlert status={transferData.Status} transferData={transferData} />

        <div className="flex flex-col gap-4">
          <BasicInfoCard
            transferData={transferData}
            oldProperty={oldProperty}
            isLoading={isLoading}
          />

          <PropertyComparisonCards
            transferData={transferData}
            oldProperty={oldProperty}
            isLoading={isLoading}
            PaymentMethod={PaymentMethod}
          />
        </div>

        {transferData.Status === EPropTransferStatus.Pending && (
          <>
            <PendingWarningAlert transferData={transferData} />

            <DialogFooter className="flex gap-2">
              {transferData.Id && (
                <RejectModal
                  id={transferData.Id}
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
