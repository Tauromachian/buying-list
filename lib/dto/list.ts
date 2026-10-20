import * as z from "zod";

export const ListDTO = z.object({
  id: z.number().positive(),
  name: z.string().nonempty(),
  createdAt: z.string().nonempty(),
  description: z.string().optional(),
});

export type List = z.infer<typeof ListDTO>;

export const CreateListDTO = ListDTO.omit({ id: true, createdAt: true });

/** Used for PATCH. All fields optional; `id` and `createdAt` are stripped. */
export const UpdateListDTO = ListDTO.omit({
  id: true,
  createdAt: true,
}).partial();

export type CreateList = z.infer<typeof CreateListDTO>;
export type UpdateList = z.infer<typeof UpdateListDTO>;
