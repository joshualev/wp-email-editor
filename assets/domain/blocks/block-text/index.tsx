/**
 * block-text/index.tsx - Text Block Schema + Defaults
 *
 * Schema: TextBlockSchema (from ./schema.ts)
 * - type: 'Text' (discriminator)
 * - data.content: String text content
 * - data.typography: Font settings (uses TYPOGRAPHY_SCHEMA)
 * - data.layout: Padding and background (uses LAYOUT_SCHEMA)
 * - data.hidden: Boolean visibility toggle
 *
 * @module domain/blocks/block-text
 */
import { z } from 'zod';
import { TEXT_BLOCK_SCHEMA } from './schema';

export const TextBlockSchema = TEXT_BLOCK_SCHEMA;
export const TextBlockPropsSchema = TEXT_BLOCK_SCHEMA.shape.data;
export type TextBlockType = z.infer<typeof TextBlockSchema>;
export type TextBlockPropsType = z.infer<typeof TextBlockPropsSchema>;

export const TextBlockPropsDefaults: TextBlockPropsType = {
  content: 'Example Paragraph Text',
  typography: {
    fontFamily: 'MODERN_SANS',
    fontWeight: 'normal',
    fontSize: 'm',
    textAlign: {
      desktop: 'left',
      mobile: 'center',
    },
    color: '#999999',
  },
  layout: {
    padding: { top: 5, right: 20, bottom: 10, left: 20 },
    background: {
      color: 'transparent',
    },
  },
  hidden: false,
};
