"use client";

import { Heart, MoreVertical, Phone, User, UserPlus2, X } from "lucide-react";
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
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, maskPhone } from "@/lib/utils";
import type { ICustomerResponse } from "@/services/api/customer/ICustomer";
import meApi from "@/services/api/meApi";

type Props = {
  className?: string;
};

const EmptyCartState = () => (
  <div className="text-center py-8 text-muted-foreground">
    <Heart className="h-8 w-8 mx-auto mb-2 opacity-50" />
    <p>Chưa có khách hàng quan tâm nào</p>
  </div>
);

const CartHeader = ({ onClose }: { onClose: () => void }) => (
  <CardHeader className="px-4">
    <div className="flex items-center justify-between">
      <div>
        <CardTitle className="text-base font-semibold">
          KHÁCH HÀNG QUAN TÂM
        </CardTitle>
        <CardDescription>Lưu tối đa 20 khách hàng</CardDescription>
      </div>
      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
        <X className="h-3 w-3" />
      </Button>
    </div>
  </CardHeader>
);

const CustomerListItem = ({ data }: { data: ICustomerResponse }) => {
  const { handleRemove } = useCartActions();

  let color = "text-blue-500 bg-blue-500/10";
  if (data.TypeName === "Tiêu dùng") color = "text-gray-500 bg-gray-500/10";
  if (data.TypeName === "Đấu giá") color = "text-amber-500 bg-amber-500/10";
  if (data.TypeName === "Đại diện") color = "text-green-500 bg-green-500/10";
  if (data.TypeName === "Môi giới")
    color = "text-destructive bg-destructive/10";

  return (
    <Card className="bg-gray-50  shadow-none hover:bg-gray-100 transition-colors ">
      <CardContent className="px-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h3 className="font-semibold">{data.Name}</h3>
              <Badge className={color}>{data.TypeName}</Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {maskPhone(data.Phone.join(", "))}
              </span>
              {/* <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {data.BuyingRequirement?.DistrictName?.join(', ')}
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                {data.BuyingRequirement?.PriceFrm} -{' '}
                {data.BuyingRequirement?.PriceTo}
              </span> */}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <User className="h-4 w-4 mr-2" />
                  Xem chi tiết
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    window.location.href = `tel:${data.Phone[0]}`;
                  }}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Gọi điện
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => handleRemove(data.Id)}
                >
                  <Heart className="h-4 w-4 mr-2 text-destructive" />
                  Xóa khỏi danh sách
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
const useCartActions = () => {
  const handleRemove = async (customerId: number) => {
    try {
      await meApi.toggleSaveCustomer(customerId);
      mutate(meApi.mutateSaveCustomersKey);
    } catch (error) {
      console.error("Error removing property:", error);
      // TODO: Add proper error handling/notification
    }
  };

  return { handleRemove };
};

export function CustomerWishlist({ className }: Props) {
  const [open, setOpen] = useState(false);

  const { data: wishlist } = meApi.useGetSaveCustomers();
  const totalCount = wishlist?.data.length ?? 0;

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
                <UserPlus2 className="h-5 w-5" />
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
              <p>Khách hàng quan tâm</p>
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

          <CardContent className="pt-0 px-2 ">
            <div className="flex flex-col space-y-2">
              {wishlist?.data.length === 0 && <EmptyCartState />}
              {wishlist?.data.map((item) => (
                <CustomerListItem key={item.Id} data={item} />
              ))}
            </div>
          </CardContent>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
