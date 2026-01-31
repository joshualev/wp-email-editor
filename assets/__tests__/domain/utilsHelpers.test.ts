import { describe, expect, it } from 'vitest';

import {
  getBorderRadius,
  getFontFamily,
  getFontSize,
  getPadding,
} from '@/Domain/Blocks/helpers/utils';

import { TEXT_SIZE_VALUES } from '@/Domain/Blocks/helpers/typography';
import { FONT_FAMILIES } from '@/Domain/Blocks/helpers/constants/fontFamily';

describe('utils helpers', () => {
  describe('getPadding', () => {
    it('returns CSS padding string for complete padding object', () => {
      const result = getPadding({ top: 10, right: 20, bottom: 30, left: 40 });
      expect(result).toBe('10px 20px 30px 40px');
    });

    it('returns "0" for undefined padding', () => {
      const result = getPadding(undefined);
      expect(result).toBe('0');
    });

    it('handles zero values', () => {
      const result = getPadding({ top: 0, right: 0, bottom: 0, left: 0 });
      expect(result).toBe('0px 0px 0px 0px');
    });

    it('uses default of 0 for missing properties', () => {
      const result = getPadding({ top: 10, right: 20 });
      expect(result).toBe('10px 20px 0px 0px');
    });

    it('handles empty object', () => {
      const result = getPadding({});
      expect(result).toBe('0px 0px 0px 0px');
    });

    it('handles large values', () => {
      const result = getPadding({ top: 100, right: 200, bottom: 300, left: 400 });
      expect(result).toBe('100px 200px 300px 400px');
    });

    it('handles decimal values', () => {
      const result = getPadding({ top: 10.5, right: 20.25, bottom: 30.75, left: 40.125 });
      expect(result).toBe('10.5px 20.25px 30.75px 40.125px');
    });

    it('returns values in correct order (top right bottom left)', () => {
      const result = getPadding({ top: 1, right: 2, bottom: 3, left: 4 });
      const parts = result.split(' ').map((p) => parseInt(p, 10));
      expect(parts).toEqual([1, 2, 3, 4]);
    });
  });

  describe('getFontFamily', () => {
    it('returns correct CSS font stack for each font key', () => {
      for (const font of FONT_FAMILIES) {
        const result = getFontFamily(font.key);
        expect(result).toBe(font.value);
      }
    });

    it('returns MODERN_SANS stack for undefined', () => {
      const result = getFontFamily(undefined);
      const modernSans = FONT_FAMILIES.find((f) => f.key === 'MODERN_SANS');
      expect(result).toBe(modernSans?.value);
    });

    it('returns MODERN_SANS stack for invalid font key', () => {
      const result = getFontFamily('INVALID_FONT');
      const modernSans = FONT_FAMILIES.find((f) => f.key === 'MODERN_SANS');
      expect(result).toBe(modernSans?.value);
    });

    it('returns MODERN_SANS stack for empty string', () => {
      const result = getFontFamily('');
      const modernSans = FONT_FAMILIES.find((f) => f.key === 'MODERN_SANS');
      expect(result).toBe(modernSans?.value);
    });

    it('is case-sensitive', () => {
      const result = getFontFamily('modern_sans');
      const modernSans = FONT_FAMILIES.find((f) => f.key === 'MODERN_SANS');
      // Should fall back to default since case doesn't match
      expect(result).toBe(modernSans?.value);
    });

    it('returns valid CSS font-family strings', () => {
      for (const font of FONT_FAMILIES) {
        const result = getFontFamily(font.key);
        // Should contain at least one font name and end with generic family
        expect(result).toMatch(/^["']?[\w\s-]+["']?(,\s*["']?[\w\s-]+["']?)*$/);
      }
    });
  });

  describe('getFontSize', () => {
    it('returns correct pixel value for each semantic size', () => {
      for (const [key, value] of Object.entries(TEXT_SIZE_VALUES)) {
        const result = getFontSize(key as keyof typeof TEXT_SIZE_VALUES);
        expect(result).toBe(value);
      }
    });

    it('returns the same number for numeric input', () => {
      const testSizes = [12, 16, 24, 32, 48, 60];
      for (const size of testSizes) {
        const result = getFontSize(size);
        expect(result).toBe(size);
      }
    });

    it('returns medium size for undefined', () => {
      const result = getFontSize(undefined);
      expect(result).toBe(TEXT_SIZE_VALUES.m);
    });

    it('returns medium size (16) for undefined', () => {
      const result = getFontSize(undefined);
      expect(result).toBe(16);
    });

    it('handles zero as numeric input', () => {
      const result = getFontSize(0);
      expect(result).toBe(0);
    });

    it('handles negative numbers as numeric input', () => {
      const result = getFontSize(-16);
      expect(result).toBe(-16);
    });

    it('handles decimal numbers', () => {
      const result = getFontSize(16.5);
      expect(result).toBe(16.5);
    });

    it('semantic sizes map to expected pixel values', () => {
      expect(getFontSize('xs')).toBe(12);
      expect(getFontSize('s')).toBe(14);
      expect(getFontSize('m')).toBe(16);
      expect(getFontSize('l')).toBe(18);
      expect(getFontSize('xl')).toBe(20);
      expect(getFontSize('xxl')).toBe(22);
    });
  });

  describe('getBorderRadius', () => {
    describe('image type', () => {
      it('returns 0 for "none"', () => {
        expect(getBorderRadius('image', 'none')).toBe(0);
      });

      it('returns 4 for "small"', () => {
        expect(getBorderRadius('image', 'small')).toBe(4);
      });

      it('returns 8 for "medium"', () => {
        expect(getBorderRadius('image', 'medium')).toBe(8);
      });

      it('returns 16 for "large"', () => {
        expect(getBorderRadius('image', 'large')).toBe(16);
      });

      it('returns "50%" for "full" (circular)', () => {
        expect(getBorderRadius('image', 'full')).toBe('50%');
      });

      it('returns 0 for unknown string values', () => {
        expect(getBorderRadius('image', 'unknown')).toBe(0);
        expect(getBorderRadius('image', '')).toBe(0);
        expect(getBorderRadius('image', 'extra-large')).toBe(0);
      });

      it('returns the same number for numeric input', () => {
        expect(getBorderRadius('image', 10)).toBe(10);
        expect(getBorderRadius('image', 24)).toBe(24);
        expect(getBorderRadius('image', 0)).toBe(0);
      });
    });

    describe('button type', () => {
      it('returns 0 for "rectangle"', () => {
        expect(getBorderRadius('button', 'rectangle')).toBe(0);
      });

      it('returns 4 for "rounded"', () => {
        expect(getBorderRadius('button', 'rounded')).toBe(4);
      });

      it('returns 9999 for "pill"', () => {
        expect(getBorderRadius('button', 'pill')).toBe(9999);
      });

      it('returns 4 (rounded default) for unknown string values', () => {
        expect(getBorderRadius('button', 'unknown')).toBe(4);
        expect(getBorderRadius('button', '')).toBe(4);
        expect(getBorderRadius('button', 'circle')).toBe(4);
      });

      it('returns the same number for numeric input', () => {
        expect(getBorderRadius('button', 8)).toBe(8);
        expect(getBorderRadius('button', 16)).toBe(16);
        expect(getBorderRadius('button', 0)).toBe(0);
      });
    });

    describe('numeric values', () => {
      it('returns numeric value unchanged for both types', () => {
        const testValues = [0, 4, 8, 16, 24, 50, 100];
        for (const value of testValues) {
          expect(getBorderRadius('image', value)).toBe(value);
          expect(getBorderRadius('button', value)).toBe(value);
        }
      });

      it('handles decimal values', () => {
        expect(getBorderRadius('image', 8.5)).toBe(8.5);
        expect(getBorderRadius('button', 12.25)).toBe(12.25);
      });
    });

    describe('type safety', () => {
      it('handles all image preset values correctly', () => {
        const imagePresets: Record<string, number | string> = {
          none: 0,
          small: 4,
          medium: 8,
          large: 16,
          full: '50%',
        };
        for (const [preset, expected] of Object.entries(imagePresets)) {
          expect(getBorderRadius('image', preset)).toBe(expected);
        }
      });

      it('handles all button preset values correctly', () => {
        const buttonPresets: Record<string, number> = {
          rectangle: 0,
          rounded: 4,
          pill: 9999,
        };
        for (const [preset, expected] of Object.entries(buttonPresets)) {
          expect(getBorderRadius('button', preset)).toBe(expected);
        }
      });
    });
  });
});
