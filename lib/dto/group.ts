import * as z from "zod";

export const GroupDTO = z.object({
  id: z.number().positive(),
  name: z.string().nonempty(),
});

export type Group = z.infer<typeof GroupDTO>;

export const CreateGroupDTO = GroupDTO.omit({ id: true });

/** Used for PATCH. All fields optional; `id` is stripped. */
export const UpdateGroupDTO = GroupDTO.omit({ id: true }).partial();

export type CreateGroup = z.infer<typeof CreateGroupDTO>;
export type UpdateGroup = z.infer<typeof UpdateGroupDTO>;
