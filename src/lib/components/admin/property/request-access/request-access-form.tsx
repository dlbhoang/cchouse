"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import PriceUnitField from "@/components/ui/form-field/price-unit";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import { ETransType } from "@/lib/core/enum";
import meApi from "@/services/api/meApi";
import {
  IPropTransferRequest,
  propTransferSchema,
} from "@/services/property/models/prop-transfer";

const RequestAccessForm = ({
  propertyId,
  transType,
  onClose,
}: {
  propertyId: number;
  transType: ETransType;
  onClose: () => void;
}) => {
  const { data: session } = useSession();
  const router = useRouter();
  const form = useForm<IPropTransferRequest>({
    resolver: zodResolver(propTransferSchema),
    defaultValues: {
      PaymentMethod: transType,
      PropId: propertyId,
      Type: 1,
      NewdUserId: session?.user.Id ?? 0,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: IPropTransferRequest) {
    console.log("🚀 ~ onSubmit ~ values:", values);
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    try {
      if (!session?.user.Id) {
        toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
        return;
      }
      await meApi.addPropTransfer({ ...values, NewdUserId: session.user.Id });
      // console.log(res);
      toast.success("Gửi thông tin thành công", {
        description: "Bộ phận kiểm duyệt sẽ liên hệ với bạn sớm nhất có thể",
      });
      router.push(AppRoutes.property.url);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="CustomerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel isRequired>Tên liên hệ</FormLabel>
              <FormControl>
                <Input placeholder="Nhập tên liên hệ" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="CustomerPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel isRequired>SĐT liên hệ</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nhập SĐT liên hệ"
                  {...field}
                  maxLength={10}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex group items-start">
          <FormField
            control={form.control}
            name="Price"
            render={({ field }) => (
              <FormItem>
                <FormLabel isRequired>
                  Giá {transType === ETransType.sell ? "bán" : "thuê"}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nhập giá"
                    type="number"
                    step={0.01}
                    {...field}
                    className="flex-1 rounded-r-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <PriceUnitField
            name="PaymentMethod"
            className="w-[140px] rounded-l-none"
          />
        </div>
        <FormField
          control={form.control}
          name="RequestNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ghi chú</FormLabel>
              <FormControl>
                <Textarea placeholder="Nhập ghi chú" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2 pt-2">
          <Button type="submit" className="flex-1">
            Gửi thông tin
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Hủy
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RequestAccessForm;
