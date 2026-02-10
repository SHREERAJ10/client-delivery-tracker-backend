import * as z from 'zod';

export const clientSchema = z.object({
    clientName: z.string().trim().min(1).max(40)
})