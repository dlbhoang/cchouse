import * as z from 'zod';

export const LeaveRequestSchema = z
  .object({
    Id: z.union([z.number(), z.null()]).optional(),
    StartDate: z.coerce.date({
      message: 'Vui lòng chọn ngày bắt đầu',
      required_error: 'Vui lòng chọn ngày bắt đầu',
    }),
    EndDate: z.coerce.date({
      message: 'Vui lòng chọn ngày kết thúc',
      required_error: 'Vui lòng chọn ngày kết thúc',
    }),
    RequestNotes: z
      .string()
      .min(100, { message: 'Lý do không được để trống, tối thiểu 100 ký tự' })
      .max(300, { message: 'Lý do không được vượt quá 300 ký tự' }),
    Type: z.union([z.number(), z.null()]).optional(),
  })
  .refine((data) => data.EndDate >= data.StartDate, {
    message: 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu',
    path: ['EndDate'],
  });

export type ILeaveRequest = z.infer<typeof LeaveRequestSchema>;
