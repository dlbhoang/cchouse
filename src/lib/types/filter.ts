import { z } from 'zod';

export const baseOptsSchema = z.object({
  search: z.string().nullable().optional(),
  pageSize: z.coerce.number().int().positive().min(1).max(100).optional(),
  pageIndex: z.coerce.number().int().nonnegative().min(0).optional(),
  sortName: z.string().nullable().optional(),
  sortType: z.enum(['asc', 'desc']).nullable().optional(),
  fromDate: z.string().nullable().optional(),
  toDate: z.string().nullable().optional(),
});

export type IBaseOpts = z.infer<typeof baseOptsSchema>;
