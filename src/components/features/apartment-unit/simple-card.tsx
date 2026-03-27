"use client";

import {
  Building,
  ExternalLink,
  Home,
  Key,
  ListStart,
  SquareDashed,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import { ETransType } from "@/lib/core/enum";
import { cn } from "@/lib/utils";
import type { IApartmentUnitResponse } from "@/services/api/apartment/unit/IApartmentUnit";

const ApartmentUnitSimpleCard = ({
  data,
  onRemove,
}: {
  data: IApartmentUnitResponse;
  onRemove: () => void;
}) => {
  return (
    <div className="bg-gray-50 border-none shadow-none hover:bg-gray-100 transition-colors px-4 py-2 rounded-lg flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <Link
          href={`${AppRoutes.apartmentUnit.url}/${data.Id}`}
          target="_blank"
          className="text-muted-foreground hover:text-primary transition-colors"
        >
          <span className="text-xs flex flex-row items-center gap-2 font-medium">
            Mã căn hộ: {data.Code}
            <ExternalLink className="h-3 w-3 " />
          </span>
        </Link>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          {data.TransType === ETransType.sell ? (
            <Home className="h-3 w-3" />
          ) : (
            <Key className="h-3 w-3" />
          )}
          {data.TransType === ETransType.sell ? "Bán" : "Thuê"}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="font-medium line-clamp-2">{data.Apartment.Name}</h3>
        <p className="text-xs text-muted-foreground">
          {data.Apartment.DistrictName}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-start gap-2">
          <Home className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-900">Loại hình</p>
            <p className="text-sm text-muted-foreground">
              {data.ApartmentUnitTypeName}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Building className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-900">Block / Tòa</p>
            <p className="text-sm text-muted-foreground">{data.Block}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <ListStart className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-900">Tầng</p>
            <p className="text-sm text-muted-foreground">{data.FloorNumber}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <SquareDashed className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-900">Diện tích</p>
            <p className="text-sm text-muted-foreground">{data.Area} m²</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-2 items-center">
          <span className={cn("font-semibold", "text-blue-600")}>
            {data.Contact.DisplayPrice}
          </span>
        </div>
        <Button variant="outline" size="icon" onClick={onRemove}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ApartmentUnitSimpleCard;
