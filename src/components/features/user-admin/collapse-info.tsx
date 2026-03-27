"use client";
import dayjs from "dayjs";
import {
  BriefcaseBusiness,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Home,
  Key,
  Mail,
  UserCircle2,
} from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { appConst } from "@/lib/core/configs/appConst";
import { useAdminContext } from "@/lib/stored";
import type { IUserAdminResponse } from "@/services/api/userAdmin/IUserAdmin";
import QrSheet from "./qr-sheet";

const InfoCard = ({
  title,
  icon: Icon,
  children,
  onEdit,
  className = "",
}: {
  title: string;
  icon: any;
  children: React.ReactNode;
  onEdit?: () => void;
  className?: string;
}) => (
  <div
    className={`group relative rounded-lg border p-4 hover:shadow-md transition-all duration-200 ${className}`}
  >
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      {onEdit && (
        <Button
          variant="ghost"
          size="sm"
          className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
          onClick={onEdit}
        >
          <ExternalLink className="h-3 w-3" />
        </Button>
      )}
    </div>
    {children}
  </div>
);

const UserCollapseInfo = ({ data }: { data: IUserAdminResponse }) => {
  const [isHeaderOpen, setIsHeaderOpen] = useState(false);
  const { enumList, managers, districts } = useAdminContext();
  const { Sex, Literacy } = enumList;
  const { UserAccess } = data;

  const [activeModal, setActiveModal] = useState<string | null>(null);

  return (
    <Card>
      <CardHeader
        className="cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsHeaderOpen(!isHeaderOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 md:h-20 md:w-20">
              <AvatarImage
                src={data.Avatar?.toString() ?? ""}
                alt={data.Name ?? ""}
                className="object-cover"
              />
              <AvatarFallback className="text-lg">
                {data.Name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">
                <div className="flex items-center gap-2">{data.Name}</div>
              </CardTitle>
              <CardDescription className="flex flex-col gap-1">
                <span>Mã nhân viên: {data.Code}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{data.RoleName}</Badge>
                  {/* <Badge variant="outline">
                    Quản lý:
                    <strong>
                      {data.ManagedBy &&
                        managers.find((x) => x.Id === data.ManagedBy)?.Name}
                    </strong>
                  </Badge> */}
                  <Badge className="bg-primary/10 text-primary">
                    <div className="mr-1 h-2 w-2 rounded-full bg-primary/80"></div>
                    Hoạt động
                  </Badge>
                </div>
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden md:block text-sm text-muted-foreground">
              {isHeaderOpen ? "Thu gọn" : "Mở rộng"}
            </span>
            {isHeaderOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </div>
        </div>
      </CardHeader>
      {isHeaderOpen && (
        <CardContent className="pt-0">
          <div className="grid gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {/* QR Code */}
            {/* <div className="flex flex-col items-center space-y-4">
              <div>
                <QRCode
                  size={100}
                  errorLevel="Q"
                  value="https://cchouse.vn/"
                  icon="/logo.png"
                  iconSize={28}
                />
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Mã QR cá nhân
              </p>
            </div> */}

            {/* Personal Info Card */}
            <InfoCard
              title="Thông tin cơ bản"
              icon={UserCircle2}
              // onEdit={() => setActiveModal('personal')}
            >
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Giới tính:</span>
                  <span className="font-medium">
                    {Sex.find((e) => e.Value === data.Sex)?.Name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ngày sinh:</span>
                  <span className="font-medium">
                    {dayjs(data.DateOfBirth).format("DD-MM-YYYY")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Trình độ:</span>
                  <span className="font-medium">
                    {Literacy.find((e) => e.Value === data.Literacy)?.Name}
                  </span>
                </div>
              </div>
            </InfoCard>

            {/* Contact Info Card */}
            <InfoCard
              title="Thông tin liên hệ"
              icon={Mail}
              // onEdit={() => setActiveModal('contact')}
            >
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">{data.Email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Điện thoại:</span>
                  <span className="font-medium">{data.Phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Địa chỉ:</span>
                  <span className="font-medium">{data.Address}</span>
                </div>
              </div>
            </InfoCard>

            {/* Work Info Card */}
            <InfoCard
              title="Công việc & Tài chính"
              icon={BriefcaseBusiness}
              // onEdit={() => setActiveModal('work')}
            >
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ngày vào:</span>
                  <span className="font-medium">
                    {dayjs(data.CreatedDate).format("DD-MM-YYYY")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Giờ làm việc:</span>
                  <span className="font-medium">
                    {dayjs(UserAccess?.TimeFrom, appConst.TIME_FORMAT).format(
                      appConst.TIME_FORMAT
                    )}{" "}
                    -{" "}
                    {dayjs(UserAccess?.TimeTo, appConst.TIME_FORMAT).format(
                      appConst.TIME_FORMAT
                    )}{" "}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hoa hồng:</span>
                  <span className="font-semibold">
                    {data?.Commission ? `${data?.Commission}%` : "Không có"}
                  </span>
                </div>
              </div>
            </InfoCard>
          </div>
          {/* Activity Segments Row */}
          <div className="grid gap-4 lg:grid-cols-2 mt-4">
            {/* Sales Segment Card */}
            <InfoCard
              title="Phân khúc bán"
              icon={Home}
              // onEdit={() => setActiveModal('sales')}
              className="border-blue-200 bg-blue-50/50 hover:bg-blue-50"
            >
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quận:</span>
                  <span className="font-semibold">
                    {UserAccess?.DistrictIds.length === districts.length
                      ? "Tất cả"
                      : Array.from(UserAccess?.DistrictIds ?? [])
                          .map(
                            (e) =>
                              districts.find((x) => x.Id === Number(e))?.Name
                          )
                          ?.join(", ")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Khung giá:</span>
                  <span className="font-semibold">
                    {UserAccess?.PriceFrm} - {UserAccess?.PriceTo} (tỷ)
                  </span>
                </div>
              </div>
            </InfoCard>

            {/* Rental Segment Card */}
            <InfoCard
              title="Phân khúc thuê"
              icon={Key}
              // onEdit={() => setActiveModal('rental')}
              className="border-orange-200 bg-orange-50/50 hover:bg-orange-50"
            >
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quận:</span>
                  <span className="font-semibold">
                    {UserAccess?.DistrictRentIds.length === districts.length
                      ? "Tất cả"
                      : Array.from(UserAccess?.DistrictRentIds ?? [])
                          .map(
                            (e) =>
                              districts.find((x) => x.Id === Number(e))?.Name
                          )
                          ?.join(", ")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Khung giá:</span>
                  <span className="font-semibold">
                    {UserAccess?.PriceRentFrm} - {UserAccess?.PriceRentTo}{" "}
                    (triệu)
                  </span>
                </div>
              </div>
            </InfoCard>
          </div>
        </CardContent>
      )}
      <CardFooter className="justify-between">
        <QrSheet
          title="QR cá nhân"
          description="Chia sẻ QR cá nhân để mọi người có thể kết nối với bạn"
          value="https://cchouse.vn/"
        />
        <div className="flex flex-col md:flex-row justify-end">
          <span className="text-muted-foreground">Quản lý bởi: </span>
          <span className="font-medium">
            {data.ManagedBy &&
              managers.find((x) => x.Id === data.ManagedBy)?.Name}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default UserCollapseInfo;
