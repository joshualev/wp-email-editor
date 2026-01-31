import { z } from 'zod';
import { TYPOGRAPHY_SCHEMA } from '../helpers/typography';
import { LAYOUT_SCHEMA } from '../helpers/layout';

export const HEADING_TYPE_SCHEMA = z.enum(['h1', 'h2', 'h3', 'h4']).default('h2');

export const HEADING_BLOCK_SCHEMA = z.object({
  type: z.literal('Heading'),
  data: z.object({
    content: z.string().default(''),
    headingType: HEADING_TYPE_SCHEMA,
    typography: TYPOGRAPHY_SCHEMA,
    layout: LAYOUT_SCHEMA,
    hidden: z.boolean().default(false),
  }),
});