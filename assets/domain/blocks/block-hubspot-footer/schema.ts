import { z } from 'zod';

export const HUBSPOT_FOOTER_SCHEMA = z.object({
  type: z.literal('HubSpotFooter'),
  data: z.object({
    fullWidth: z.boolean().default(false),
    backgroundColor: z.string().default('#f5f5f5'),
  }),
});
