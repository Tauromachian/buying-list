import * as z from "zod";

export const UserDTO = z.object({
  id: z.number().positive(),
  name: z.string().nonempty(),
  password: z.string().nonempty(),
});

export type User = z.infer<typeof UserDTO>;

export const CreateUserDTO = UserDTO.omit({ id: true });

/** Used for PATCH. All fields optional; `id` is stripped. */
export const UpdateUserDTO = UserDTO.omit({ id: true }).partial();

export type CreateUser = z.infer<typeof CreateUserDTO>;
export type UpdateUser = z.infer<typeof UpdateUserDTO>;
