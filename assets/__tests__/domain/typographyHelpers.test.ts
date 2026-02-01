import { describe, expect, it } from 'vitest';

import {
  COLOR_SCHEMA,
  FONT_FAMILY_SCHEMA,
  FONT_SIZE_SCHEMA,
  FONT_WEIGHT_SCHEMA,
  HEADING_SIZE_VALUES,
  RESPONSIVE_TEXT_ALIGN_SCHEMA,
  TEXT_SIZE_VALUES,
  TYPOGRAPHY_SCHEMA,
  getResponsiveTextAlign,
} from '@/domain/blocks/helpers/typography';

import { HORIZONTAL_ALIGN_VALUES } from '@/domain/blocks/helpers/layout';
import { FONT_FAMILY_NAMES } from '@/domain/blocks/helpers/constants/fontFamily';

describe('typography helpers', () => {
  describe('RESPONSIVE_TEXT_ALIGN_SCHEMA', () => {
    it('requires an object with desktop and mobile properties', () => {
      const valid = RESPONSIVE_TEXT_ALIGN_SCHEMA.parse({
        desktop: 'right',
        mobile: 'left',
      });
      expect(valid).toEqual({ desktop: 'right', mobile: 'left' });
    });

    it('applies defaults when properties are missing', () => {
      const parsed = RESPONSIVE_TEXT_ALIGN_SCHEMA.parse({});
      expect(parsed).toEqual({ desktop: 'left', mobile: 'center' });
    });

    it('rejects number values', () => {
      const result = RESPONSIVE_TEXT_ALIGN_SCHEMA.safeParse(42);
      expect(result.success).toBe(false);
    });

    it('rejects null', () => {
      const result = RESPONSIVE_TEXT_ALIGN_SCHEMA.safeParse(null);
      expect(result.success).toBe(false);
    });

    it('rejects invalid alignment values', () => {
      const result = RESPONSIVE_TEXT_ALIGN_SCHEMA.safeParse({
        desktop: 'justify',
        mobile: 'center',
      });
      expect(result.success).toBe(false);
    });

    it('validates all alignment combinations', () => {
      for (const desktop of HORIZONTAL_ALIGN_VALUES) {
        for (const mobile of HORIZONTAL_ALIGN_VALUES) {
          const result = RESPONSIVE_TEXT_ALIGN_SCHEMA.safeParse({ desktop, mobile });
          expect(result.success).toBe(true);
          if (result.success) {
            expect(result.data).toEqual({ desktop, mobile });
          }
        }
      }
    });
  });

  describe('getResponsiveTextAlign', () => {
    it('returns desktop value when not mobile', () => {
      expect(getResponsiveTextAlign({ desktop: 'right', mobile: 'left' }, false)).toBe('right');
      expect(getResponsiveTextAlign({ desktop: 'center', mobile: 'left' }, false)).toBe('center');
      expect(getResponsiveTextAlign({ desktop: 'left', mobile: 'right' }, false)).toBe('left');
    });

    it('returns mobile value when mobile', () => {
      expect(getResponsiveTextAlign({ desktop: 'right', mobile: 'left' }, true)).toBe('left');
      expect(getResponsiveTextAlign({ desktop: 'center', mobile: 'right' }, true)).toBe('right');
      expect(getResponsiveTextAlign({ desktop: 'left', mobile: 'center' }, true)).toBe('center');
    });

    it('handles same value for both viewports', () => {
      const value = { desktop: 'center', mobile: 'center' } as const;
      expect(getResponsiveTextAlign(value, false)).toBe('center');
      expect(getResponsiveTextAlign(value, true)).toBe('center');
    });
  });

  describe('FONT_SIZE_SCHEMA', () => {
    it('accepts all semantic size values', () => {
      const sizes = ['xs', 's', 'm', 'l', 'xl', 'xxl'] as const;
      for (const size of sizes) {
        const result = FONT_SIZE_SCHEMA.safeParse(size);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe(size);
        }
      }
    });

    it('accepts custom numeric sizes within valid range (12-60)', () => {
      const validSizes = [12, 16, 24, 32, 48, 60];
      for (const size of validSizes) {
        const result = FONT_SIZE_SCHEMA.safeParse(size);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe(size);
        }
      }
    });

    it('rejects numeric sizes below minimum (12)', () => {
      const invalidSizes = [0, 1, 10, 11, 11.9];
      for (const size of invalidSizes) {
        const result = FONT_SIZE_SCHEMA.safeParse(size);
        expect(result.success).toBe(false);
      }
    });

    it('rejects numeric sizes above maximum (60)', () => {
      const invalidSizes = [61, 72, 100, 999];
      for (const size of invalidSizes) {
        const result = FONT_SIZE_SCHEMA.safeParse(size);
        expect(result.success).toBe(false);
      }
    });

    it('rejects negative numbers', () => {
      const result = FONT_SIZE_SCHEMA.safeParse(-16);
      expect(result.success).toBe(false);
    });

    it('defaults to medium size', () => {
      const parsed = FONT_SIZE_SCHEMA.parse(undefined);
      expect(parsed).toBe('m');
    });

    it('rejects invalid string values', () => {
      const invalidValues = ['small', 'large', 'medium', 'extra-large', ''];
      for (const value of invalidValues) {
        const result = FONT_SIZE_SCHEMA.safeParse(value);
        expect(result.success).toBe(false);
      }
    });
  });

  describe('FONT_FAMILY_SCHEMA', () => {
    it('accepts all defined font family names', () => {
      for (const fontName of FONT_FAMILY_NAMES) {
        const result = FONT_FAMILY_SCHEMA.safeParse(fontName);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe(fontName);
        }
      }
    });

    it('defaults to MODERN_SANS', () => {
      const parsed = FONT_FAMILY_SCHEMA.parse(undefined);
      expect(parsed).toBe('MODERN_SANS');
    });

    it('rejects invalid font family names', () => {
      const invalidFonts = ['Arial', 'Helvetica', 'Times New Roman', 'INVALID_FONT', ''];
      for (const font of invalidFonts) {
        const result = FONT_FAMILY_SCHEMA.safeParse(font);
        expect(result.success).toBe(false);
      }
    });

    it('is case-sensitive', () => {
      const result = FONT_FAMILY_SCHEMA.safeParse('modern_sans');
      expect(result.success).toBe(false);
    });
  });

  describe('FONT_WEIGHT_SCHEMA', () => {
    it('accepts valid weight values', () => {
      const weights = ['light', 'normal', 'bold'] as const;
      for (const weight of weights) {
        const result = FONT_WEIGHT_SCHEMA.safeParse(weight);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe(weight);
        }
      }
    });

    it('defaults to normal', () => {
      const parsed = FONT_WEIGHT_SCHEMA.parse(undefined);
      expect(parsed).toBe('normal');
    });

    it('rejects numeric weights', () => {
      const numericWeights = [100, 300, 400, 700, 900];
      for (const weight of numericWeights) {
        const result = FONT_WEIGHT_SCHEMA.safeParse(weight);
        expect(result.success).toBe(false);
      }
    });

    it('rejects invalid string weights', () => {
      const invalidWeights = ['thin', 'medium', 'heavy', 'bolder', ''];
      for (const weight of invalidWeights) {
        const result = FONT_WEIGHT_SCHEMA.safeParse(weight);
        expect(result.success).toBe(false);
      }
    });
  });

  describe('COLOR_SCHEMA', () => {
    it('accepts hex color values', () => {
      const colors = ['#000000', '#FFFFFF', '#ff5733', '#F5F5F5'];
      for (const color of colors) {
        const result = COLOR_SCHEMA.safeParse(color);
        expect(result.success).toBe(true);
      }
    });

    it('accepts named colors', () => {
      const colors = ['red', 'blue', 'transparent'];
      for (const color of colors) {
        const result = COLOR_SCHEMA.safeParse(color);
        expect(result.success).toBe(true);
      }
    });

    it('accepts rgb/rgba values', () => {
      const colors = ['rgb(255, 0, 0)', 'rgba(0, 0, 0, 0.5)'];
      for (const color of colors) {
        const result = COLOR_SCHEMA.safeParse(color);
        expect(result.success).toBe(true);
      }
    });

    it('defaults to transparent', () => {
      const parsed = COLOR_SCHEMA.parse(undefined);
      expect(parsed).toBe('transparent');
    });

    it('rejects non-string values', () => {
      const result = COLOR_SCHEMA.safeParse(123);
      expect(result.success).toBe(false);
    });
  });

  describe('TYPOGRAPHY_SCHEMA', () => {
    it('applies all defaults for empty object', () => {
      const parsed = TYPOGRAPHY_SCHEMA.parse({});
      expect(parsed).toEqual({
        fontSize: 'm',
        fontFamily: 'MODERN_SANS',
        fontWeight: 'normal',
        textAlign: { desktop: 'left', mobile: 'center' },
        color: '#000000',
      });
    });

    it('preserves explicitly set values', () => {
      const input = {
        fontSize: 'xl',
        fontFamily: 'BOOK_SERIF',
        fontWeight: 'bold',
        textAlign: { desktop: 'center', mobile: 'right' },
        color: '#FF0000',
      };
      const parsed = TYPOGRAPHY_SCHEMA.parse(input);
      expect(parsed).toEqual(input);
    });

    it('allows partial overrides while using defaults', () => {
      const parsed = TYPOGRAPHY_SCHEMA.parse({
        fontSize: 'l',
        textAlign: { desktop: 'right' },
      });
      expect(parsed.fontSize).toBe('l');
      expect(parsed.fontFamily).toBe('MODERN_SANS');
      expect(parsed.fontWeight).toBe('normal');
      expect(parsed.textAlign.desktop).toBe('right');
      expect(parsed.textAlign.mobile).toBe('center');
      expect(parsed.color).toBe('#000000');
    });

    it('accepts custom numeric font size', () => {
      const parsed = TYPOGRAPHY_SCHEMA.parse({ fontSize: 28 });
      expect(parsed.fontSize).toBe(28);
    });

    it('rejects invalid fontSize', () => {
      const result = TYPOGRAPHY_SCHEMA.safeParse({ fontSize: 8 });
      expect(result.success).toBe(false);
    });

    it('rejects invalid fontFamily', () => {
      const result = TYPOGRAPHY_SCHEMA.safeParse({ fontFamily: 'Comic Sans' });
      expect(result.success).toBe(false);
    });

    it('rejects invalid fontWeight', () => {
      const result = TYPOGRAPHY_SCHEMA.safeParse({ fontWeight: 'extra-bold' });
      expect(result.success).toBe(false);
    });
  });

  describe('TEXT_SIZE_VALUES', () => {
    it('has correct pixel values for each semantic size', () => {
      expect(TEXT_SIZE_VALUES).toEqual({
        xs: 12,
        s: 14,
        m: 16,
        l: 18,
        xl: 20,
        xxl: 22,
      });
    });

    it('has ascending values', () => {
      const values = Object.values(TEXT_SIZE_VALUES);
      for (let i = 1; i < values.length; i++) {
        expect(values[i]).toBeGreaterThan(values[i - 1]);
      }
    });
  });

  describe('HEADING_SIZE_VALUES', () => {
    it('has correct pixel values for each semantic size', () => {
      expect(HEADING_SIZE_VALUES).toEqual({
        xs: 16,
        s: 20,
        m: 24,
        l: 28,
        xl: 32,
        xxl: 36,
      });
    });

    it('has ascending values', () => {
      const values = Object.values(HEADING_SIZE_VALUES);
      for (let i = 1; i < values.length; i++) {
        expect(values[i]).toBeGreaterThan(values[i - 1]);
      }
    });

    it('heading sizes are larger than text sizes for same semantic key', () => {
      const keys = Object.keys(TEXT_SIZE_VALUES) as (keyof typeof TEXT_SIZE_VALUES)[];
      for (const key of keys) {
        expect(HEADING_SIZE_VALUES[key]).toBeGreaterThan(TEXT_SIZE_VALUES[key]);
      }
    });
  });
});
