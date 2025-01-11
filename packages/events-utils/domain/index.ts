import { z } from 'zod'

export const EventSchema = z.object({
  event_type: z.string(),
  actor: z.object({
    id: z.string().optional(),
    type: z.string(),
  }),
})

export type EventValues = z.infer<typeof EventSchema>
