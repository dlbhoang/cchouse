"use client";

import { ExternalLink, Home, Key, SquareDashed, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import { ETransType } from "@/lib/core/enum";
import type { IPropResponse } from "@/lib/interfaces/Property/IProp";
import { cn } from "@/lib/utils";

const PropSimpleCard = ({
  data,
  onRemove,
}: {
  data: IPropResponse;
  onRemove: () => void;
}) => {
  return (
    <div className="bg-gray-50 border-none shadow-none hover:bg-gray-100 transition-colors px-4 py-2 rounded-lg flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <Link
          href={`${AppRoutes.property.url}/${data.Id}`}
          target="_blank"
          className="text-muted-foreground hover:text-primary transition-colors"
        >
          <span className="text-xs flex flex-row items-center gap-2">
            Mã: {data.Id}
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

      <h3 className="font-medium mb-1 line-clamp-2">
        {data.PropAddress.DisplayAddress}
      </h3>
      {/* <p className="text-sm text-gray-600 mb-2">{data.Address}</p> */}
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-2">
          <Home className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-900">Loại BĐS</p>
            <p className="text-sm text-gray-600">
              {data.PropAddress.PropTypeName}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <SquareDashed className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-900">Diện tích</p>
            <p className="text-sm text-gray-600">
              {data.Area} m²
              {data.Length &&
                data.Width &&
                ` (${data.Length}m × ${data.Width}m)`}
            </p>
          </div>
        </div>
        {/* <div className="basis-1/3">
          <PhoneBtn phone={data.CustomerPhone?.[0]} />
        </div> */}
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-2 items-center">
          <span className={cn("font-semibold", "text-blue-600")}>
            {data.DisplayPrice}
          </span>
          {data.TransType === ETransType.sell && data.PricePerSquareMeter && (
            <div className="text-sm text-muted-foreground">
              {data.PricePerSquareMeter}
            </div>
          )}
        </div>
        <Button variant="outline" size="icon" onClick={onRemove}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PropSimpleCard;
