/**
 * helpers/utils.ts - Block Utility Functions
 *
 * Provides helper functions for converting schema values to CSS.
 * Used by all block render components for consistent styling.
 *
 * Functions:
 * - getPadding(): Converts padding object to CSS string
 * - getFontFamily(): Maps font key to CSS font-family stack
 * - getFontSize(): Resolves size key or number to pixels
 * - getBorderRadius(): Converts radius preset to CSS value
 *
 * Border Radius Presets:
 * Images: none(0), small(4), medium(8), large(16), full(50%)
 * Buttons: rectangle(0), rounded(4), pill(9999)
 *
 * @module Domain/Blocks/helpers/utils
 */
import { TEXT_SIZE_VALUES } from './typography';
import { FONT_FAMILIES } from './constants/fontFamily';

export function getPadding(padding?: { top?: number; right?: number; bottom?: number; left?: number }): string {
  if (!padding) return '0';
  const { top = 0, right = 0, bottom = 0, left = 0 } = padding;
  return `${top}px ${right}px ${bottom}px ${left}px`;
}

export function getFontFamily(fontFamily?: string) {
  const family = FONT_FAMILIES.find(f => f.key === fontFamily);
  return family?.value ?? FONT_FAMILIES[0].value;
}

export function getFontSize(size?: keyof typeof TEXT_SIZE_VALUES | number) {
  if (typeof size === 'number') return size;
  if (!size) return TEXT_SIZE_VALUES.m;
  return TEXT_SIZE_VALUES[size];
}
// utils.ts
export function getBorderRadius(type: 'button' | 'image', value: string | number): string | number {
  if (typeof value === 'number') return value;

  if (type === 'image') {
    switch (value) {
      case 'none':
        return 0;
      case 'small':
        return 4;
      case 'medium':
        return 8;
      case 'large':
        return 16;
      case 'full':
        return '50%';
      default:
        return 0;
    }
  }

  // For buttons
  switch (value) {
    case 'rectangle':
      return 0;
    case 'pill':
      return 9999;
    case 'rounded':
      return 4;
    default:
      return 4;
  }
}
