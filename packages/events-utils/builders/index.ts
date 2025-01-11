import type { EventSchema, MetadataSchema } from '../domain'

export function buildEventDetails(
  data: NonNullable<unknown>,
  metadata: MetadataSchema
): EventSchema {
  return {
    data,
    metadata,
  }
}
