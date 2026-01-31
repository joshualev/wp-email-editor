/**
 * block-button/index.tsx - Button Block Schema + Defaults
 *
 * Schema: ButtonBlockSchema (from ./schema.ts)
 * - type: 'Button' (discriminator)
 * - data.content: Button label text
 * - data.button: URL, fullWidth, variant
 * - data.typography: Font settings and text color
 * - data.layout: Padding and background (button color)
 *
 * @module Domain/Blocks/block-button
 */
import { z } from 'zod';
import { BUTTON_BLOCK_SCHEMA } from './schema';

export const ButtonBlockSchema = BUTTON_BLOCK_SCHEMA;
export const ButtonBlockPropsSchema = BUTTON_BLOCK_SCHEMA.shape.data;
export type ButtonBlockType = z.infer<typeof ButtonBlockSchema>;
export type ButtonBlockPropsType = z.infer<typeof ButtonBlockPropsSchema>;

export const ButtonBlockPropsDefaults: ButtonBlockPropsType = {
  content: 'Click here',
  button: {
    url: '#',
    fullWidth: false,
    variant: 'rounded',
  },
  typography: {
    fontFamily: 'MODERN_SANS',
    fontWeight: 'normal',
    fontSize: 'm',
    textAlign: {
      desktop: 'left',
      mobile: 'center',
    },
    color: '#ffffff',
  },
  layout: {
    padding: { top: 5, right: 20, bottom: 5, left: 20 },
    background: { color: '#000000' },
  },
  hidden: false,
};
