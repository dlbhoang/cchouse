"use client";

import { ShoppingCart, X } from "lucide-react";
import { useState } from "react";
import { mutate } from "swr";
import PropSimpleCard from "@/components/features/property/simple-card";
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
import type { IPropResponse } from "@/lib/interfaces/Property/IProp";
import { cn } from "@/lib/utils";
import userAdminApi from "@/services/api/userAdmin/userAdminApi";

interface PropCartsProps {
  className?: string;
  userId: number;
}

interface CartSectionProps {
  items: IPropResponse[] | undefined;
  type: "sell" | "rent";
  onRemove: (propId: number) => void;
}

const EmptyCartState = ({ type }: { type: "sell" | "rent" }) => (
  <div className="text-center py-8 text-muted-foreground">
    <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-50" />
    <p>Chưa có bất động sản {type === "sell" ? "mua bán" : "cho thuê"} nào</p>
  </div>
);

const CartSection = ({ items, type, onRemove }: CartSectionProps) => {
  if (!items || items.length === 0) {
    return <EmptyCartState type={type} />;
  }

  return (
    <div className="space-y-3 max-h-[600px] overflow-y-auto">
      {items.map((item, index) => (
        <PropSimpleCard
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
          GIỎ HÀNG CỦA BẠN
        </CardTitle>
        <CardDescription>Lưu tối đa 20 bất động sản</CardDescription>
      </div>
      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
        <X className="h-3 w-3" />
      </Button>
    </div>
  </CardHeader>
);

const useCartData = (userId: number) => {
  const { data } = userAdminApi.useGetSaveProps(userId);

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
      await userAdminApi.toggleSaveProp(propId);
      mutate(userAdminApi.mutateSavePropsKey);
    } catch (error) {
      console.error("Error removing property:", error);
      // TODO: Add proper error handling/notification
    }
  };

  return { handleRemove };
};

export function PropCarts({ className, userId }: PropCartsProps) {
  const [open, setOpen] = useState(false);

  const { cartSell, cartRent, totalCount, sellCount, rentCount } =
    useCartData(userId);
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
                <ShoppingCart className="h-5 w-5" />
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
              <p>Giỏ hàng / Quan tâm</p>
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
