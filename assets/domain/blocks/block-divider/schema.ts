import { z } from 'zod';
import { LAYOUT_SCHEMA } from '../helpers/layout';

export const DIVIDER_STYLE_SCHEMA = z.enum([
  'solid',
  'dashed',
  'dotted'
]).default('solid');

export const DIVIDER_SCHEMA = z.object({
  style: DIVIDER_STYLE_SCHEMA,
  thickness: z.number().min(1).max(10).default(1),
  width: z.union([
    z.literal('full'),
    z.number().min(1).max(100)
  ]).default('full'),
});

export const DIVIDER_BLOCK_SCHEMA = z.object({
  type: z.literal('Divider'),
  data: z.object({
    divider: DIVIDER_SCHEMA,
    layout: LAYOUT_SCHEMA,
    hidden: z.boolean().default(false),
  }),
});