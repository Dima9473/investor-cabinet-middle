import { z } from 'zod'

export const accountSchema = z.object({
    id: z.string(),
    openedDate: z.string().optional(),
    closedDate: z.string().optional(),
    name: z.string().optional(),
}) 
