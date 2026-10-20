import * as z from "zod";

export const ItemDTO = z.object({
  id: z.number().positive(),
  listId: z.number().positive(),
  name: z.string().nonempty(),
  quantity: z.number().positive(),
  checked: z.boolean(),
  createdAt: z.string().optional(),
  checkedAt: z.string().optional(),
});

export const CreateItemDTO = ItemDTO.omit({
  id: true,
  checkedAt: true,
  createdAt: true,
});

export const UpdateItemDTO = ItemDTO.omit({
  id: true,
  checkedAt: true,
  createdAt: true,
}).partial();

export type Item = z.infer<typeof ItemDTO>;
export type CreateItem = z.infer<typeof CreateItemDTO>;
export type UpdateItem = z.infer<typeof UpdateItemDTO>;
