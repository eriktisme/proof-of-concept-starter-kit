import { z } from 'zod'
import { buildHandler } from './handler'
import type { MigrationEvent } from './types'
import { withContext } from '@internal/lambda/context'

const ConfigSchema = z.object({
  connectionString: z.string(),
})

const config = ConfigSchema.parse({
  connectionString: process.env.POSTGRESS_URL,
})

export const handler = withContext<MigrationEvent, unknown>(
  async (_, event, context) =>
    buildHandler(event, context, {
      connectionString: config.connectionString,
    })
)
