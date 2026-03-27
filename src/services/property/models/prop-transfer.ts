import { z } from "zod";
import { baseOptsSchema } from "@/lib/types/filter";
import { APP_MESSAGE, APP_REGEX } from "@/lib/utils";

export const propTransferSchema = z.object({
  Id: z.number().optional(),
  CustomerName: z.string({ message: APP_MESSAGE.REQUIRED }),
  CustomerPhone: z
    .string({ message: APP_MESSAGE.REQUIRED })
    .min(10, "Tối thiểu 10 ký tự")
    .regex(APP_REGEX.PHONE_NUMBER, APP_MESSAGE.PHONE_NUMBER_INVALID),
  Price: z.coerce
    .number({ message: APP_MESSAGE.REQUIRED })
    .min(0, "Giá bán không thể là số âm."),
  PaymentMethod: z.coerce.number({ message: APP_MESSAGE.REQUIRED }),
  PropId: z.number({ message: APP_MESSAGE.REQUIRED }),

  Type: z.number({ message: APP_MESSAGE.REQUIRED }),
  NewdUserId: z.number({ message: APP_MESSAGE.REQUIRED }),
  RequestNotes: z.string().optional(),
});

export type IPropTransferRequest = z.infer<typeof propTransferSchema>;

export interface IPropTransferResponse extends IPropTransferRequest {
  NewdUserName?: null | string;
  OlddUserId?: number;
  OlddUserName?: null | string;
  Status?: EPropTransferStatus;
  StatusName?: null | string;

  ApproveDate?: null | string;
  ApproveNotes?: null | string;
  ApproveUserName?: string;
}

/**
 * ApproveTransferRequest
 */
export interface IApproveTransferRequest {
  Id?: number;
  Notes?: null | string;
  Status?: EPropTransferStatus;
}

export enum EPropTransferStatus {
  Pending = 0,
  Approved = 1,
  Rejected = 2,
}
export enum EPropTransferType {
  InSegment = 0, // Trong phân khúc - tạo tự động
  AboveSegment = 1, // Vượt phân khúc
}

export const PropTransferStatusOptions = [
  { label: "Chờ duyệt", value: EPropTransferStatus.Pending },
  { label: "Đã duyệt", value: EPropTransferStatus.Approved },
  { label: "Từ chối", value: EPropTransferStatus.Rejected },
];

export const propTransferOptsSchema = baseOptsSchema.extend({
  Type: z.coerce.number().int().nonnegative().optional(),
  Status: z.coerce.number().int().nonnegative().min(0).optional(),
  PropId: z.coerce.number().int().positive().optional(),
  NewUserId: z.coerce.number().int().nonnegative().min(0).optional(),
  OldUserId: z.coerce.number().int().nonnegative().min(0).optional(),
});

export type IPropTransferOpts = z.infer<typeof propTransferOptsSchema>;
