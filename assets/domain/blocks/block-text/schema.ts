import { z } from 'zod';
import { TYPOGRAPHY_SCHEMA } from '../helpers/typography';
import { LAYOUT_SCHEMA } from '../helpers/layout';

export const TEXT_BLOCK_SCHEMA = z.object({
  type: z.literal('Text'),
  data: z.object({
    content: z.string().default(''),
    typography: TYPOGRAPHY_SCHEMA,
    layout: LAYOUT_SCHEMA,
    hidden: z.boolean().default(false),
  }),
});