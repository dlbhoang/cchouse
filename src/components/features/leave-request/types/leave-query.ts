import z from "zod";
import { baseOptsSchema } from "@/lib/types/filter";

export const leaveQuerySchema = baseOptsSchema.extend({
  Type: z.coerce.number().int().nonnegative().optional(),
  UserRequestId: z.coerce.number().int().nonnegative().min(0).optional(),
  Status: z.coerce.number().int().nonnegative().optional(),
});

export type ILeaveQuery = z.infer<typeof leaveQuerySchema>;
