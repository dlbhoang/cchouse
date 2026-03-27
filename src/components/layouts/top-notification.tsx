"use client";

import dayjs from "dayjs";
import { Bell, Check, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { mutate } from "swr";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import { formatTimeAgo } from "@/lib/core/utils/myFormat";
import type {
  INotiOpts,
  INotiUserResponse,
} from "@/services/api/notifications/INoti";
import notiApi from "@/services/api/notifications/notiApi";
import userAdminApi from "@/services/api/userAdmin/userAdminApi";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const CartHeader = ({
  onClose,
  onMarkAllAsRead,
}: {
  onClose: () => void;
  onMarkAllAsRead: () => void;
}) => (
  <CardHeader className="px-4">
    <div className="flex items-center justify-between">
      <div>
        <CardTitle className="text-base font-semibold">THÔNG BÁO</CardTitle>
      </div>
      <div>
        <Button variant="link" onClick={onMarkAllAsRead}>
          <Check className="h-3 w-3" />
          Đã đọc tất cả
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onClose}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  </CardHeader>
);

const NotificationItem = ({ item }: { item: INotiUserResponse }) => {
  return (
    <Card className="border-0 shadow-none p-4 hover:bg-gray-50 cursor-pointer">
      <CardContent className="p-0">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarImage
              src={item.Notification.CreatedAvatar || "/placeholder.svg"}
              alt="User avatar"
              className="object-cover"
            />
            <AvatarFallback>NA</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium mb-1">
              {item.Notification.Title}
            </div>
            <div className="text-sm text-muted-foreground mb-2 line-clamp-2">
              {item.Notification.Description}
            </div>
            <div className="text-xs text-primary">
              {formatTimeAgo(dayjs(item.Notification.CreatedDate))}
            </div>
            {(item.Notification.AttachFiles?.length ?? 0) > 0 && (
              <div className="text-xs text-muted-foreground">Tệp đính kèm</div>
            )}
          </div>

          {item.Status === 0 && (
            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const TopNotification = () => {
  const [open, setOpen] = useState(false);
  const [opts, setOpts] = useState<INotiOpts>({ pageIndex: 1, pageSize: 10 });
  const [items, setItems] = useState<INotiUserResponse[]>([]);

  const { data: count } = userAdminApi.useCountUnReadNoti();
  const { data, isLoading } = userAdminApi.useGetNotifications(opts);

  const [tabKey, setTabKey] = useState<"all" | "unread">("all");

  const scrollHandler = (e: React.UIEvent<HTMLElement>): void => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;

    if (scrollHeight - scrollTop <= clientHeight + 10 && !isLoading) {
      setOpts((prev) => ({ ...prev, pageIndex: prev.pageIndex + 1 }));
    }
  };

  useEffect(() => {
    if (data?.data) {
      const newItems = data?.data ?? [];
      if (opts.pageIndex === 1) {
        setItems(newItems);
      } else {
        setItems((prev) => [...prev, ...newItems]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.data]);

  const handleTabChange = (value: string) => {
    setTabKey(value as "all" | "unread");
    setItems([]);
    if (value === "unread") {
      setOpts({ pageIndex: 1, pageSize: 10, Status: 0 });
    } else {
      setOpts({ pageIndex: 1, pageSize: 10 });
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="relative">
                <Bell className="h-5 w-5" />
                {(count?.data ?? 0) > 0 && (
                  <Badge
                    variant="warning"
                    className="absolute -end-4 -top-4 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs text-white"
                  >
                    {(count?.data ?? 0) > 99 ? "99+" : count?.data}
                  </Badge>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Thông báo</p>
            </TooltipContent>
          </Tooltip>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-sm max-w-sm h-[800px] overflow-hidden"
      >
        <Card className="border-0 py-2 shadow-none gap-2">
          <CartHeader
            onClose={() => setOpen(false)}
            onMarkAllAsRead={async () => {
              if ((count?.data ?? 0) > 0) {
                await notiApi.markAllAsRead();
                setItems([]);
                setOpts({ pageSize: 10, pageIndex: 1 });
                mutate(userAdminApi.countUnReadKey);
              }
            }}
          />
          <CardContent className="pt-0 px-4">
            <Tabs
              defaultValue="all"
              value={tabKey}
              onValueChange={handleTabChange}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="all">Tất cả </TabsTrigger>
                <TabsTrigger value="unread">
                  Chưa đọc ({count?.data ?? 0})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-2">
                <div
                  className="max-h-[600px] overflow-y-auto pr-2"
                  onScroll={scrollHandler}
                >
                  {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Bell className="h-12 w-12 text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Không có thông báo
                      </h3>
                      <p className="text-muted-foreground">
                        Bạn sẽ nhận được thông báo khi có hoạt động mới
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col divide-y divide-gray-100">
                      {items.map((item) => (
                        <Link
                          key={item.Notification.Id}
                          href={`${AppRoutes.notifications.url}/${item.Notification.Id}`}
                        >
                          <NotificationItem item={item} />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="unread" className="mt-2">
                <div
                  className="max-h-[600px] overflow-y-auto pr-2"
                  onScroll={scrollHandler}
                >
                  {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Bell className="h-12 w-12 text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Không có thông báo
                      </h3>
                      <p className="text-muted-foreground">
                        Bạn sẽ nhận được thông báo khi có hoạt động mới
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {items.map((item) => (
                        <NotificationItem
                          key={item.Notification.Id}
                          item={item}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TopNotification;
