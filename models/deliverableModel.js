import * as z from "zod";

export const deliverableSchema = z.object({
  deliverableName: z.string().trim().min(1).max(50),
  projectId: z.uuid(),
  statusId: z.uuid(),
  due_Date: z.iso.datetime(),
  note: z.string().trim().max(100).optional().or(z.literal('')),
});
