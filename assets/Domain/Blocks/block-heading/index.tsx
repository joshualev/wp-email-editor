/**
 * block-heading/index.tsx - Heading Block Schema + Defaults
 *
 * Schema: HeadingBlockSchema (from ./schema.ts)
 * - type: 'Heading' (discriminator)
 * - data.content: Heading text
 * - data.headingType: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
 * - data.typography: Font settings with heading-specific sizes
 * - data.layout: Padding and background
 *
 * @module Domain/Blocks/block-heading
 */
import { z } from 'zod';
import { HEADING_BLOCK_SCHEMA } from './schema';

export const HeadingBlockSchema = HEADING_BLOCK_SCHEMA;
export const HeadingBlockPropsSchema = HEADING_BLOCK_SCHEMA.shape.data;
export type HeadingBlockType = z.infer<typeof HeadingBlockSchema>;
export type HeadingBlockPropsType = z.infer<typeof HeadingBlockPropsSchema>;

export const HeadingBlockPropsDefaults: HeadingBlockPropsType = {
  content: 'Example Heading',
  headingType: 'h2',
  typography: {
    fontFamily: 'MODERN_SANS',
    fontWeight: 'normal',
    fontSize: 'm',
    textAlign: {
      desktop: 'left',
      mobile: 'center',
    },
    color: '#111111',
  },
  layout: {
    padding: { top: 5, right: 20, bottom: 5, left: 20 },
    background: {
      color: 'transparent',
    },
  },
  hidden: false,
};
