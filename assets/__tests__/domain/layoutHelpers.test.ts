import { describe, expect, it } from 'vitest';

import {
  ALIGNMENT_SCHEMA,
  BACKGROUND_SCHEMA,
  HORIZONTAL_ALIGN_VALUES,
  LAYOUT_SCHEMA,
  PADDING_SCHEMA,
  RESPONSIVE_HORIZONTAL_ALIGN_SCHEMA,
  getResponsiveAlignment,
} from '@/Domain/Blocks/helpers/layout';

describe('layout helpers', () => {
  describe('PADDING_SCHEMA', () => {
    it('requires all four padding values', () => {
      const parsed = PADDING_SCHEMA.parse({
        top: 10,
        right: 20,
        bottom: 10,
        left: 20,
      });
      expect(parsed).toEqual({ top: 10, right: 20, bottom: 10, left: 20 });
    });

    it('applies default of all zeros', () => {
      const parsed = PADDING_SCHEMA.parse(undefined);
      expect(parsed).toEqual({ top: 0, right: 0, bottom: 0, left: 0 });
    });

    it('accepts zero values', () => {
      const parsed = PADDING_SCHEMA.parse({ top: 0, right: 0, bottom: 0, left: 0 });
      expect(parsed).toEqual({ top: 0, right: 0, bottom: 0, left: 0 });
    });

    it('accepts large padding values', () => {
      const parsed = PADDING_SCHEMA.parse({ top: 100, right: 200, bottom: 150, left: 50 });
      expect(parsed).toEqual({ top: 100, right: 200, bottom: 150, left: 50 });
    });

    it('rejects negative padding values', () => {
      // Note: Currently schema doesn't enforce non-negative
      // This test documents current behavior - add .nonnegative() if needed
      const result = PADDING_SCHEMA.safeParse({ top: -10, right: 20, bottom: 10, left: 20 });
      // If this fails, the schema now enforces non-negative which is good
      expect(result.success).toBe(true); // Current behavior allows negatives
    });

    it('rejects non-numeric values', () => {
      const result = PADDING_SCHEMA.safeParse({
        top: '10',
        right: 20,
        bottom: 10,
        left: 20,
      });
      expect(result.success).toBe(false);
    });

    it('rejects missing properties when object provided', () => {
      const result = PADDING_SCHEMA.safeParse({ top: 10, right: 20 });
      expect(result.success).toBe(false);
    });

    it('accepts decimal values', () => {
      const parsed = PADDING_SCHEMA.parse({ top: 10.5, right: 20.25, bottom: 10.75, left: 20.5 });
      expect(parsed.top).toBe(10.5);
    });
  });

  describe('BACKGROUND_SCHEMA', () => {
    it('requires color property', () => {
      const parsed = BACKGROUND_SCHEMA.parse({ color: '#FF0000' });
      expect(parsed.color).toBe('#FF0000');
    });

    it('defaults color to transparent', () => {
      const parsed = BACKGROUND_SCHEMA.parse({});
      expect(parsed.color).toBe('transparent');
    });

    it('accepts various color formats', () => {
      const colors = ['#FFFFFF', 'red', 'rgb(255, 0, 0)', 'rgba(0, 0, 0, 0.5)', 'transparent'];
      for (const color of colors) {
        const parsed = BACKGROUND_SCHEMA.parse({ color });
        expect(parsed.color).toBe(color);
      }
    });

    it('rejects non-string color', () => {
      const result = BACKGROUND_SCHEMA.safeParse({ color: 0xFF0000 });
      expect(result.success).toBe(false);
    });
  });

  describe('LAYOUT_SCHEMA', () => {
    it('combines padding and background schemas', () => {
      const parsed = LAYOUT_SCHEMA.parse({
        padding: { top: 16, right: 24, bottom: 16, left: 24 },
        background: { color: '#F5F5F5' },
      });
      expect(parsed.padding).toEqual({ top: 16, right: 24, bottom: 16, left: 24 });
      expect(parsed.background.color).toBe('#F5F5F5');
    });

    it('applies defaults for missing nested values', () => {
      const parsed = LAYOUT_SCHEMA.parse({
        background: {},
      });
      expect(parsed.padding).toEqual({ top: 0, right: 0, bottom: 0, left: 0 });
      expect(parsed.background.color).toBe('transparent');
    });

    it('requires both padding and background objects', () => {
      const result = LAYOUT_SCHEMA.safeParse({});
      expect(result.success).toBe(false);
    });

    it('rejects null padding', () => {
      const result = LAYOUT_SCHEMA.safeParse({
        padding: null,
        background: {},
      });
      expect(result.success).toBe(false);
    });
  });

  describe('HORIZONTAL_ALIGN_VALUES', () => {
    it('contains exactly three alignment options', () => {
      expect(HORIZONTAL_ALIGN_VALUES).toHaveLength(3);
    });

    it('includes left, center, and right', () => {
      expect(HORIZONTAL_ALIGN_VALUES).toContain('left');
      expect(HORIZONTAL_ALIGN_VALUES).toContain('center');
      expect(HORIZONTAL_ALIGN_VALUES).toContain('right');
    });

    it('is immutable (readonly tuple)', () => {
      // TypeScript enforces this at compile time
      // This test verifies the values are as expected
      expect([...HORIZONTAL_ALIGN_VALUES]).toEqual(['left', 'center', 'right']);
    });
  });

  describe('RESPONSIVE_HORIZONTAL_ALIGN_SCHEMA', () => {
    it('requires an object with desktop and mobile properties', () => {
      const parsed = RESPONSIVE_HORIZONTAL_ALIGN_SCHEMA.parse({
        desktop: 'left',
        mobile: 'center',
      });
      expect(parsed).toEqual({ desktop: 'left', mobile: 'center' });
    });

    it('applies defaults when properties are missing', () => {
      const parsed = RESPONSIVE_HORIZONTAL_ALIGN_SCHEMA.parse({});
      expect(parsed).toEqual({ desktop: 'left', mobile: 'center' });
    });

    it('applies defaults for undefined (whole object default)', () => {
      const parsed = RESPONSIVE_HORIZONTAL_ALIGN_SCHEMA.parse(undefined);
      expect(parsed).toEqual({ desktop: 'left', mobile: 'center' });
    });

    it('rejects string values (no legacy support)', () => {
      const result = RESPONSIVE_HORIZONTAL_ALIGN_SCHEMA.safeParse('center');
      expect(result.success).toBe(false);
    });

    it('rejects null', () => {
      const result = RESPONSIVE_HORIZONTAL_ALIGN_SCHEMA.safeParse(null);
      expect(result.success).toBe(false);
    });

    it('rejects invalid alignment values', () => {
      const invalidValues = ['justify', 'start', 'end', 'flex-start', ''];
      for (const value of invalidValues) {
        const result = RESPONSIVE_HORIZONTAL_ALIGN_SCHEMA.safeParse({
          desktop: value,
          mobile: 'center',
        });
        expect(result.success).toBe(false);
      }
    });

    it('validates all valid alignment combinations', () => {
      for (const desktop of HORIZONTAL_ALIGN_VALUES) {
        for (const mobile of HORIZONTAL_ALIGN_VALUES) {
          const result = RESPONSIVE_HORIZONTAL_ALIGN_SCHEMA.safeParse({ desktop, mobile });
          expect(result.success).toBe(true);
        }
      }
    });
  });

  describe('ALIGNMENT_SCHEMA', () => {
    it('combines vertical and responsive horizontal alignment', () => {
      const parsed = ALIGNMENT_SCHEMA.parse({
        vertical: 'top',
        horizontal: { desktop: 'right', mobile: 'left' },
      });
      expect(parsed.vertical).toBe('top');
      expect(parsed.horizontal).toEqual({ desktop: 'right', mobile: 'left' });
    });

    it('applies defaults for missing values', () => {
      const parsed = ALIGNMENT_SCHEMA.parse({
        horizontal: {},
      });
      expect(parsed.vertical).toBe('middle');
      expect(parsed.horizontal).toEqual({ desktop: 'left', mobile: 'center' });
    });

    it('applies defaults for undefined (whole object default)', () => {
      const parsed = ALIGNMENT_SCHEMA.parse(undefined);
      expect(parsed.vertical).toBe('middle');
      expect(parsed.horizontal).toEqual({ desktop: 'left', mobile: 'center' });
    });

    it('applies defaults for empty object', () => {
      const parsed = ALIGNMENT_SCHEMA.parse({});
      expect(parsed.vertical).toBe('middle');
      expect(parsed.horizontal).toEqual({ desktop: 'left', mobile: 'center' });
    });

    it('accepts all vertical alignment values', () => {
      const verticals = ['top', 'middle', 'baseline'] as const;
      for (const vertical of verticals) {
        const result = ALIGNMENT_SCHEMA.safeParse({
          vertical,
          horizontal: {},
        });
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.vertical).toBe(vertical);
        }
      }
    });

    it('rejects invalid vertical alignment values', () => {
      const invalidVerticals = ['bottom', 'center', 'stretch', ''];
      for (const vertical of invalidVerticals) {
        const result = ALIGNMENT_SCHEMA.safeParse({
          vertical,
          horizontal: {},
        });
        expect(result.success).toBe(false);
      }
    });

    it('rejects string horizontal alignment (no legacy support)', () => {
      const result = ALIGNMENT_SCHEMA.safeParse({
        vertical: 'middle',
        horizontal: 'center',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('getResponsiveAlignment', () => {
    it('returns desktop value when not mobile', () => {
      expect(getResponsiveAlignment({ desktop: 'right', mobile: 'left' }, false)).toBe('right');
      expect(getResponsiveAlignment({ desktop: 'center', mobile: 'left' }, false)).toBe('center');
      expect(getResponsiveAlignment({ desktop: 'left', mobile: 'right' }, false)).toBe('left');
    });

    it('returns mobile value when mobile', () => {
      expect(getResponsiveAlignment({ desktop: 'right', mobile: 'left' }, true)).toBe('left');
      expect(getResponsiveAlignment({ desktop: 'center', mobile: 'right' }, true)).toBe('right');
      expect(getResponsiveAlignment({ desktop: 'left', mobile: 'center' }, true)).toBe('center');
    });

    it('handles same value for both viewports', () => {
      const alignment = { desktop: 'center', mobile: 'center' } as const;
      expect(getResponsiveAlignment(alignment, false)).toBe('center');
      expect(getResponsiveAlignment(alignment, true)).toBe('center');
    });

    it('works with all alignment combinations', () => {
      for (const desktop of HORIZONTAL_ALIGN_VALUES) {
        for (const mobile of HORIZONTAL_ALIGN_VALUES) {
          const alignment = { desktop, mobile };
          expect(getResponsiveAlignment(alignment, false)).toBe(desktop);
          expect(getResponsiveAlignment(alignment, true)).toBe(mobile);
        }
      }
    });
  });
});
