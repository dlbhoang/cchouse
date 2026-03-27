"use client";
import {
  ArrowRight,
  Home,
  Info,
  MapPin,
  SquareDashed,
  User,
} from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ETransType } from "@/lib/core/enum";
import { IPropAccess } from "@/services/property";
import RequestAccessForm from "./request-access-form";

type Props = {
  model: IPropAccess;
};

const RequestAccess = ({ model }: Props) => {
  const property = model.Prop;
  const [showForm, setShowForm] = useState(false);

  const formatAddress = () => {
    const parts = [
      property?.AddressNumber,
      property?.StreetName,
      property?.SubAddressName,
      property?.WardName,
      property?.DistrictName,
    ].filter(Boolean);

    return parts.length > 0 ? parts.join(", ") : "Địa chỉ chưa cập nhật";
  };
  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:h-[80vh] justify-center gap-3 items-center">
        <Card className="w-[400px] h-fit max-w-sm">
          <CardHeader>
            <CardTitle className="text-lg">
              Chi tiết bất động sản - Mã: {property?.Id}
            </CardTitle>
            <CardDescription>
              Bạn không thuộc phân khúc xem thông tin bất động sản này, nên chỉ
              xem được một vài thông tin cơ bản.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <User className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Người tạo</p>
                  <p className="text-sm text-gray-600">
                    {property?.UserAdminName}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Home className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Loại giao dịch
                  </p>
                  <p className="text-sm text-gray-600">
                    {property?.TransType === ETransType.sell
                      ? "Mua bán"
                      : property?.TransType === ETransType.rent
                      ? "Cho thuê"
                      : "Không xác định"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Địa chỉ</p>
                  <p className="text-sm text-gray-600">{formatAddress()}</p>
                </div>
              </div>

              {property?.Area && (
                <div className="flex items-start gap-2">
                  <SquareDashed className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Diện tích
                    </p>
                    <p className="text-sm text-gray-600">
                      {property?.Area} m²
                      {property?.Length &&
                        property?.Width &&
                        ` (${property?.Length}m × ${property?.Width}m)`}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 pt-0">
            <Alert className="bg-blue-500/10 dark:bg-blue-600/30 border-none">
              <Info className="!text-blue-500" />
              <div className="flex-col justify-start">
                <AlertTitle>Bạn có thông tin chủ sở hữu?</AlertTitle>
                <AlertDescription>
                  Bổ sung thông tin để được hưởng quyền lợi.
                </AlertDescription>
                <span
                  className="text-blue-500 cursor-pointer mt-2 flex items-center gap-1"
                  onClick={() => setShowForm(true)}
                >
                  Bổ sung ngay <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Alert>
          </CardFooter>
        </Card>
        {showForm && (
          <Card className="w-[400px] h-fit max-w-sm">
            <CardHeader>
              <CardTitle className="text-lg">Thông tin chủ nhà / Giá</CardTitle>
              <CardDescription>
                Vui lòng điền thông tin, bộ phận kiểm duyệt sẽ thông báo kết quả
                cho bạn trong thời gian sớm nhất.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RequestAccessForm
                propertyId={property?.Id ?? 0}
                transType={property?.TransType ?? ETransType.sell}
                onClose={() => setShowForm(false)}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RequestAccess;
