import * as z from "zod";

export const ListDTO = z.object({
  id: z.number().positive(),
  name: z.string().nonempty(),
  createdAt: z.string().nonempty(),
  description: z.string().optional(),
});
