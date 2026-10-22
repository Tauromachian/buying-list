import * as z from "zod";

export const GroupDTO = z.object({
  id: z.number(),
  name: z.string(),
});

export type Group = z.infer<typeof GroupDTO>;
