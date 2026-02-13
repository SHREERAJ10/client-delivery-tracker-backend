import * as z from 'zod';

export const clientSchema = z.object({
    projectName: z.string().trim().min(1).max(50),
    clientId:z.uuid(),
    statusId: z.uuid(),
    due_Date:z.iso.datetime()
})