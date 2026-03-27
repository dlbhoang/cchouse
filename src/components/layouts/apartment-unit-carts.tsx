"use client";

import { HousePlus, X } from "lucide-react";
import { useState } from "react";
import { mutate } from "swr";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ETransType } from "@/lib/core/enum";
import { cn } from "@/lib/utils";
import type { IApartmentUnitResponse } from "@/services/api/apartment/unit/IApartmentUnit";
import meApi from "@/services/api/meApi";
import ApartmentUnitSimpleCard from "../features/apartment-unit/simple-card";

interface PropCartsProps {
  className?: string;
}

interface CartSectionProps {
  items: IApartmentUnitResponse[] | undefined;
  type: "sell" | "rent";
  onRemove: (propId: number) => void;
}

const EmptyCartState = ({ type }: { type: "sell" | "rent" }) => (
  <div className="text-center py-8 text-muted-foreground">
    <HousePlus className="h-8 w-8 mx-auto mb-2 opacity-50" />
    <p>Chưa có căn hộ {type === "sell" ? "mua bán" : "cho thuê"} nào</p>
  </div>
);

const CartSection = ({ items, type, onRemove }: CartSectionProps) => {
  if (!items || items.length === 0) {
    return <EmptyCartState type={type} />;
  }

  return (
    <div className="space-y-3 max-h-[600px] overflow-y-auto">
      {items.map((item, index) => (
        <ApartmentUnitSimpleCard
          key={`${type}-${item.Id}-${index}`}
          data={item}
          onRemove={() => onRemove(item.Id)}
        />
      ))}
    </div>
  );
};

const CartHeader = ({ onClose }: { onClose: () => void }) => (
  <CardHeader className="px-4">
    <div className="flex items-center justify-between">
      <div>
        <CardTitle className="text-base font-semibold">
          GIỎ HÀNG CĂN HỘ
        </CardTitle>
        <CardDescription>Lưu tối đa 20 căn hộ</CardDescription>
      </div>
      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
        <X className="h-3 w-3" />
      </Button>
    </div>
  </CardHeader>
);

const useCartData = () => {
  const { data } = meApi.useGetSaveApartmentUnits();

  const cartSell = data?.data.filter((x) => x.TransType === ETransType.sell);
  const cartRent = data?.data.filter((x) => x.TransType === ETransType.rent);

  return {
    data,
    cartSell,
    cartRent,
    totalCount: data?.data.length ?? 0,
    sellCount: cartSell?.length ?? 0,
    rentCount: cartRent?.length ?? 0,
  };
};

const useCartActions = () => {
  const handleRemove = async (propId: number) => {
    try {
      await meApi.toggleSaveApartmentUnit(propId);
      mutate(meApi.mutateSaveApartmentUnitKey);
    } catch (error) {
      console.error("Error removing toggleSaveApartmentUnit:", error);
      // TODO: Add proper error handling/notification
    }
  };

  return { handleRemove };
};

export function ApartmentUnitCarts({ className }: PropCartsProps) {
  const [open, setOpen] = useState(false);

  const { cartSell, cartRent, totalCount, sellCount, rentCount } =
    useCartData();
  const { handleRemove } = useCartActions();

  const handleClose = () => setOpen(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn("rounded-full", className)}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="relative">
                <HousePlus className="h-5 w-5" />
                {totalCount > 0 && (
                  <Badge
                    variant="warning"
                    className="absolute -end-4 -top-4 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs text-white"
                  >
                    {totalCount > 99 ? "99+" : totalCount}
                  </Badge>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Giỏ hàng căn hộ</p>
            </TooltipContent>
          </Tooltip>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-sm max-w-sm h-[800px] overflow-hidden"
      >
        <Card className="border-0 shadow-none py-2 gap-2">
          <CartHeader onClose={handleClose} />

          <CardContent className="pt-0 px-4">
            <Tabs defaultValue="sell" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="sell">Mua bán ({sellCount})</TabsTrigger>
                <TabsTrigger value="rent">Cho thuê ({rentCount})</TabsTrigger>
              </TabsList>

              <TabsContent value="sell" className="mt-2">
                <CartSection
                  items={cartSell}
                  type="sell"
                  onRemove={handleRemove}
                />
              </TabsContent>

              <TabsContent value="rent" className="mt-2">
                <CartSection
                  items={cartRent}
                  type="rent"
                  onRemove={handleRemove}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
