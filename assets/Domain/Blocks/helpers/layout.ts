/**
 * helpers/layout.ts - Layout Schema and Utilities
 *
 * Provides Zod schemas for block positioning, padding, backgrounds,
 * and responsive alignment. Used by all content blocks.
 *
 * Key Schemas:
 * - PADDING_SCHEMA: Top/right/bottom/left pixel values
 * - BACKGROUND_SCHEMA: Background color configuration
 * - LAYOUT_SCHEMA: Combined padding + background
 * - ALIGNMENT_SCHEMA: Vertical + responsive horizontal alignment
 *
 * Responsive Design:
 * RESPONSIVE_HORIZONTAL_ALIGN_SCHEMA supports separate desktop/mobile
 * values with automatic migration from legacy single-value strings.
 *
 * Key Exports:
 * - LAYOUT_SCHEMA: Standard layout config for blocks
 * - getResponsiveAlignment(): Returns alignment based on viewport
 * - HORIZONTAL_ALIGN_VALUES: ['left', 'center', 'right']
 *
 * @module Domain/Blocks/helpers/layout
 */
import { z } from 'zod';

export const PADDING_SCHEMA = z.object({
  top: z.number(),
  right: z.number(),
  bottom: z.number(),
  left: z.number()
}).default({ top: 0, right: 0, bottom: 0, left: 0 });

export const BACKGROUND_SCHEMA = z.object({
  color: z.string().default('transparent'),
});

export const LAYOUT_SCHEMA = z.object({
  padding: PADDING_SCHEMA,
  background: BACKGROUND_SCHEMA,
});

// Horizontal alignment values
export const HORIZONTAL_ALIGN_VALUES = ['left', 'center', 'right'] as const;
export type HorizontalAlignValue = typeof HORIZONTAL_ALIGN_VALUES[number];

// Responsive alignment - supports desktop/mobile values
// Uses preprocess to handle legacy string values for backward compatibility
export const RESPONSIVE_HORIZONTAL_ALIGN_SCHEMA = z.preprocess(
  (val) => {
    // If it's already an object, use it as-is
    if (typeof val === 'object' && val !== null) {
      return val;
    }
    // If it's a legacy string value, convert to responsive object
    if (typeof val === 'string' && HORIZONTAL_ALIGN_VALUES.includes(val as HorizontalAlignValue)) {
      return { desktop: val, mobile: 'center' };
    }
    // Default fallback
    return { desktop: 'left', mobile: 'center' };
  },
  z.object({
    desktop: z.enum(HORIZONTAL_ALIGN_VALUES).default('left'),
    mobile: z.enum(HORIZONTAL_ALIGN_VALUES).default('center'),
  })
);
export type ResponsiveHorizontalAlignValue = z.infer<typeof RESPONSIVE_HORIZONTAL_ALIGN_SCHEMA>;

// Legacy alignment schema (for backward compatibility)
export const ALIGNMENT_SCHEMA = z.object({
  vertical: z.enum(['top', 'middle', 'baseline']).default('middle'),
  horizontal: RESPONSIVE_HORIZONTAL_ALIGN_SCHEMA,
});
export type AlignmentValue = z.infer<typeof ALIGNMENT_SCHEMA>;

// Helper to get alignment based on screen size
export function getResponsiveAlignment(
  alignment: ResponsiveHorizontalAlignValue,
  isMobile: boolean
): HorizontalAlignValue {
  return isMobile ? alignment.mobile : alignment.desktop;
}