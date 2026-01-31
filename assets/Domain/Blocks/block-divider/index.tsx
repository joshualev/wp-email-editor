/**
 * block-divider/index.tsx - Divider Block Schema + Defaults
 *
 * Schema: DividerBlockSchema (from ./schema.ts)
 * - type: 'Divider' (discriminator)
 * - data.divider: style, thickness, width
 * - data.layout: Padding and color (background.color = line color)
 *
 * @module Domain/Blocks/block-divider
 */
import { z } from 'zod';
import { DIVIDER_BLOCK_SCHEMA } from './schema';

export const DividerBlockSchema = DIVIDER_BLOCK_SCHEMA;
export const DividerBlockPropsSchema = DIVIDER_BLOCK_SCHEMA.shape.data;
export type DividerBlockType = z.infer<typeof DividerBlockSchema>;
export type DividerBlockPropsType = z.infer<typeof DividerBlockPropsSchema>;

export const DividerBlockPropsDefaults: DividerBlockPropsType = {
  divider: {
    style: 'solid',
    thickness: 1,
    width: 'full',
  },
  layout: {
    padding: { top: 0, right: 0, bottom: 0, left: 0 },
    background: { color: '#000000' },
  },
  hidden: false,
};
