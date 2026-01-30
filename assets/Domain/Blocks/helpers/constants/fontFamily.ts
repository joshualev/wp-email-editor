/**
 * constants/fontFamily.ts - Email-Safe Font Stack Definitions
 *
 * Defines web-safe font family stacks for email rendering.
 * Each stack provides fallbacks to ensure consistent display
 * across email clients with varying font support.
 *
 * Font Categories:
 * - Sans-serif: MODERN_SANS, BOOK_SANS, ORGANIC_SANS, GEOMETRIC_SANS,
 *               HEAVY_SANS, ROUNDED_SANS
 * - Serif: MODERN_SERIF, BOOK_SERIF
 * - Monospace: MONOSPACE
 *
 * Usage:
 * Font families are referenced by key (e.g., 'MODERN_SANS') in block
 * schemas and resolved to full CSS stacks via getFontFamily() util.
 *
 * @module Domain/Blocks/helpers/constants/fontFamily
 */
export const FONT_FAMILIES = [
  {
    key: 'MODERN_SANS',
    label: 'Modern sans',
    value: '"Helvetica Neue", "Arial Nova", "Nimbus Sans", Arial, sans-serif',
  },
  {
    key: 'BOOK_SANS',
    label: 'Book sans',
    value: 'Optima, Candara, "Noto Sans", source-sans-pro, sans-serif',
  },
  {
    key: 'ORGANIC_SANS',
    label: 'Organic sans',
    value: 'Seravek, "Gill Sans Nova", Ubuntu, Calibri, "DejaVu Sans", source-sans-pro, sans-serif',
  },
  {
    key: 'GEOMETRIC_SANS',
    label: 'Geometric sans',
    value: 'Avenir, "Avenir Next LT Pro", Montserrat, Corbel, "URW Gothic", source-sans-pro, sans-serif',
  },
  {
    key: 'HEAVY_SANS',
    label: 'Heavy sans',
    value:
      'Bahnschrift, "DIN Alternate", "Franklin Gothic Medium", "Nimbus Sans Narrow", sans-serif-condensed, sans-serif',
  },
  {
    key: 'ROUNDED_SANS',
    label: 'Rounded sans',
    value:
      'ui-rounded, "Hiragino Maru Gothic ProN", Quicksand, Comfortaa, Manjari, "Arial Rounded MT Bold", Calibri, source-sans-pro, sans-serif',
  },
  {
    key: 'MODERN_SERIF',
    label: 'Modern serif',
    value: 'Charter, "Bitstream Charter", "Sitka Text", Cambria, serif',
  },
  {
    key: 'BOOK_SERIF',
    label: 'Book serif',
    value: '"Iowan Old Style", "Palatino Linotype", "URW Palladio L", P052, serif',
  },
  {
    key: 'MONOSPACE',
    label: 'Monospace',
    value: '"Nimbus Mono PS", "Courier New", "Cutive Mono", monospace',
  },
];

export const FONT_FAMILY_NAMES = [
  'MODERN_SANS',
  'BOOK_SANS',
  'ORGANIC_SANS',
  'GEOMETRIC_SANS',
  'HEAVY_SANS',
  'ROUNDED_SANS',
  'MODERN_SERIF',
  'BOOK_SERIF',
  'MONOSPACE',
] as const;