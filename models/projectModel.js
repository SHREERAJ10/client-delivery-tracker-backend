import * as z from 'zod';

export const projectSchema = z.object({
    projectName: z.string().trim().min(1).max(50),
    clientId:z.uuid(),
    statusId: z.uuid(),
    statusDetail:z.string().trim().min(1).max(100),
    due_Date:z.iso.datetime()
})