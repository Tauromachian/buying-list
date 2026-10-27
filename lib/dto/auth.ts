import * as z from "zod";

export const LoginDTO = z.object({
  email: z.string().nonempty(),
  password: z.string().nonempty(),
});
