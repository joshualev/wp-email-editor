/**
 * helpers/typography.ts - Typography Schema and Utilities
 *
 * Provides Zod schemas and helpers for text styling across all blocks.
 * Defines font sizes, families, weights, and alignment with responsive support.
 *
 * Size Scales:
 * - TEXT_SIZE_VALUES: xs(12) through xxl(22) for body text
 * - HEADING_SIZE_VALUES: xs(16) through xxl(36) for headings
 *
 * Responsive Alignment:
 * RESPONSIVE_TEXT_ALIGN_SCHEMA supports separate desktop/mobile values.
 *
 * Key Exports:
 * - TYPOGRAPHY_SCHEMA: Combined schema for all typography options
 * - getResponsiveTextAlign(): Returns alignment based on viewport
 * - FONT_SIZE_SCHEMA, FONT_FAMILY_SCHEMA, FONT_WEIGHT_SCHEMA
 *
 * @module domain/blocks/helpers/typography
 */
import { z } from 'zod';
import { FONT_FAMILY_NAMES } from './constants/fontFamily';
import { HORIZONTAL_ALIGN_VALUES, HorizontalAlignValue } from './layout';

export const COLOR_SCHEMA = z.string().default('transparent');

// Font sizes with semantic naming
export const TEXT_SIZE_VALUES = {
  xs: 12,
  s: 14,
  m: 16,
  l: 18,
  xl: 20,
  xxl: 22,
} as const;

// Font sizes with semantic naming
export const HEADING_SIZE_VALUES = {
  xs: 16,
  s: 20,
  m: 24,
  l: 28,
  xl: 32,
  xxl: 36,
} as const;

export const FONT_SIZE_SCHEMA = z.union([
  z.enum(['xs', 's', 'm', 'l', 'xl', 'xxl']),
  z.number().min(12).max(60).describe('custom'),
]).default('m');
export type FontSizeValue =
  | keyof typeof TEXT_SIZE_VALUES
  | keyof typeof HEADING_SIZE_VALUES
  | number;

export const FONT_FAMILY_SCHEMA = z.enum(FONT_FAMILY_NAMES).default('MODERN_SANS');
export type FontFamilyValue = z.infer<typeof FONT_FAMILY_SCHEMA>;

export const FONT_WEIGHT_SCHEMA = z.enum([
  'light',
  'normal',
  'bold'
]).default('normal');
export type FontWeightValue = z.infer<typeof FONT_WEIGHT_SCHEMA>;

// Responsive text alignment - supports separate desktop/mobile values
export const RESPONSIVE_TEXT_ALIGN_SCHEMA = z.object({
  desktop: z.enum(HORIZONTAL_ALIGN_VALUES).default('left'),
  mobile: z.enum(HORIZONTAL_ALIGN_VALUES).default('center'),
}).default({ desktop: 'left', mobile: 'center' });
export type ResponsiveTextAlignValue = z.infer<typeof RESPONSIVE_TEXT_ALIGN_SCHEMA>;

// Helper to get text alignment based on screen size
export function getResponsiveTextAlign(
  textAlign: ResponsiveTextAlignValue,
  isMobile: boolean
): HorizontalAlignValue {
  return isMobile ? textAlign.mobile : textAlign.desktop;
}

// Combined typography schema for reuse (with responsive textAlign)
export const TYPOGRAPHY_SCHEMA = z.object({
  fontSize: FONT_SIZE_SCHEMA,
  fontFamily: FONT_FAMILY_SCHEMA,
  fontWeight: FONT_WEIGHT_SCHEMA,
  textAlign: RESPONSIVE_TEXT_ALIGN_SCHEMA,
  color: z.string().default('#000000'),
});

export type TypographyValue = z.infer<typeof TYPOGRAPHY_SCHEMA>;