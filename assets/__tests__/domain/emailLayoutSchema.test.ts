import { describe, expect, it } from 'vitest';

import {
  EmailLayoutBlockPropsSchema,
  EmailLayoutBlockSchema,
} from '@/domain/blocks/block-email-layout/schema';
import { FONT_FAMILY_NAMES } from '@/domain/blocks/helpers/constants/fontFamily';

describe('EmailLayoutBlockPropsSchema', () => {
  describe('defaults', () => {
    it('applies all default values for empty object', () => {
      const parsed = EmailLayoutBlockPropsSchema.parse({});
      expect(parsed).toEqual({
        backdropColor: '#F5F5F5',
        canvasColor: '#FFFFFF',
        textColor: '#262626',
        fontFamily: 'MODERN_SANS',
        childrenIds: [],
      });
    });

    it('uses consistent default colors that provide good contrast', () => {
      const parsed = EmailLayoutBlockPropsSchema.parse({});
      // Backdrop should be darker than canvas for visual separation
      expect(parsed.backdropColor).not.toBe(parsed.canvasColor);
      // Text should contrast with canvas
      expect(parsed.textColor).not.toBe(parsed.canvasColor);
    });
  });

  describe('backdropColor', () => {
    it('accepts valid hex colors', () => {
      const colors = ['#000000', '#FFFFFF', '#123456', '#abcdef'];
      for (const color of colors) {
        const result = EmailLayoutBlockPropsSchema.safeParse({ backdropColor: color });
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.backdropColor).toBe(color);
        }
      }
    });

    it('accepts named colors', () => {
      const parsed = EmailLayoutBlockPropsSchema.parse({ backdropColor: 'lightgray' });
      expect(parsed.backdropColor).toBe('lightgray');
    });

    it('accepts rgb/rgba values', () => {
      const parsed = EmailLayoutBlockPropsSchema.parse({ backdropColor: 'rgb(245, 245, 245)' });
      expect(parsed.backdropColor).toBe('rgb(245, 245, 245)');
    });

    it('rejects non-string values', () => {
      const result = EmailLayoutBlockPropsSchema.safeParse({ backdropColor: 0xF5F5F5 });
      expect(result.success).toBe(false);
    });
  });

  describe('canvasColor', () => {
    it('accepts valid hex colors', () => {
      const parsed = EmailLayoutBlockPropsSchema.parse({ canvasColor: '#EEEEEE' });
      expect(parsed.canvasColor).toBe('#EEEEEE');
    });

    it('defaults to white', () => {
      const parsed = EmailLayoutBlockPropsSchema.parse({});
      expect(parsed.canvasColor).toBe('#FFFFFF');
    });
  });

  describe('textColor', () => {
    it('accepts valid hex colors', () => {
      const parsed = EmailLayoutBlockPropsSchema.parse({ textColor: '#333333' });
      expect(parsed.textColor).toBe('#333333');
    });

    it('defaults to near-black for readability', () => {
      const parsed = EmailLayoutBlockPropsSchema.parse({});
      expect(parsed.textColor).toBe('#262626');
    });
  });

  describe('fontFamily', () => {
    it('accepts all valid font family names', () => {
      for (const fontName of FONT_FAMILY_NAMES) {
        const result = EmailLayoutBlockPropsSchema.safeParse({ fontFamily: fontName });
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.fontFamily).toBe(fontName);
        }
      }
    });

    it('rejects invalid font family names', () => {
      const invalidFonts = ['Arial', 'Helvetica', 'Comic Sans', 'invalid'];
      for (const font of invalidFonts) {
        const result = EmailLayoutBlockPropsSchema.safeParse({ fontFamily: font });
        expect(result.success).toBe(false);
      }
    });

    it('is case-sensitive', () => {
      const result = EmailLayoutBlockPropsSchema.safeParse({ fontFamily: 'modern_sans' });
      expect(result.success).toBe(false);
    });
  });

  describe('childrenIds', () => {
    it('defaults to empty array', () => {
      const parsed = EmailLayoutBlockPropsSchema.parse({});
      expect(parsed.childrenIds).toEqual([]);
    });

    it('accepts array of string IDs', () => {
      const ids = ['row-1', 'row-2', 'row-3'];
      const parsed = EmailLayoutBlockPropsSchema.parse({ childrenIds: ids });
      expect(parsed.childrenIds).toEqual(ids);
    });

    it('preserves order of IDs', () => {
      const ids = ['c', 'a', 'b'];
      const parsed = EmailLayoutBlockPropsSchema.parse({ childrenIds: ids });
      expect(parsed.childrenIds).toEqual(['c', 'a', 'b']);
    });

    it('accepts empty strings as IDs', () => {
      const parsed = EmailLayoutBlockPropsSchema.parse({ childrenIds: ['', 'valid'] });
      expect(parsed.childrenIds).toEqual(['', 'valid']);
    });

    it('accepts duplicate IDs', () => {
      const parsed = EmailLayoutBlockPropsSchema.parse({ childrenIds: ['a', 'a', 'b'] });
      expect(parsed.childrenIds).toEqual(['a', 'a', 'b']);
    });

    it('rejects non-string values in array', () => {
      const result = EmailLayoutBlockPropsSchema.safeParse({ childrenIds: [123, 'valid'] });
      expect(result.success).toBe(false);
    });

    it('rejects non-array values', () => {
      const invalidValues = ['string', 123, {}, null];
      for (const value of invalidValues) {
        const result = EmailLayoutBlockPropsSchema.safeParse({ childrenIds: value });
        expect(result.success).toBe(false);
      }
    });
  });

  describe('immutability', () => {
    it('does not mutate input values', () => {
      const input = {
        backdropColor: '#111111',
        canvasColor: '#222222',
        textColor: '#333333',
        fontFamily: 'BOOK_SANS',
        childrenIds: ['a', 'b'],
      };
      const inputCopy = { ...input, childrenIds: [...input.childrenIds] };
      EmailLayoutBlockPropsSchema.parse(input);
      expect(input).toEqual(inputCopy);
    });

    it('preserves provided values without modification', () => {
      const input = {
        backdropColor: '#111111',
        canvasColor: '#222222',
        textColor: '#333333',
        fontFamily: 'BOOK_SANS' as const,
        childrenIds: ['a', 'b'],
      };
      const parsed = EmailLayoutBlockPropsSchema.parse(input);
      expect(parsed).toEqual(input);
    });
  });
});

describe('EmailLayoutBlockSchema', () => {
  describe('type literal', () => {
    it('requires type to be exactly "EmailLayout"', () => {
      const result = EmailLayoutBlockSchema.safeParse({
        type: 'EmailLayout',
        data: {},
      });
      expect(result.success).toBe(true);
    });

    it('rejects other type values', () => {
      const invalidTypes = ['Layout', 'Email', 'Root', 'Container', ''];
      for (const type of invalidTypes) {
        const result = EmailLayoutBlockSchema.safeParse({
          type,
          data: {},
        });
        expect(result.success).toBe(false);
      }
    });

    it('rejects missing type', () => {
      const result = EmailLayoutBlockSchema.safeParse({ data: {} });
      expect(result.success).toBe(false);
    });
  });

  describe('complete block validation', () => {
    it('accepts minimal valid block', () => {
      const parsed = EmailLayoutBlockSchema.parse({
        type: 'EmailLayout',
        data: {},
      });
      expect(parsed.type).toBe('EmailLayout');
      expect(parsed.data).toEqual({
        backdropColor: '#F5F5F5',
        canvasColor: '#FFFFFF',
        textColor: '#262626',
        fontFamily: 'MODERN_SANS',
        childrenIds: [],
      });
    });

    it('accepts fully specified block', () => {
      const input = {
        type: 'EmailLayout' as const,
        data: {
          backdropColor: '#E0E0E0',
          canvasColor: '#FAFAFA',
          textColor: '#1A1A1A',
          fontFamily: 'BOOK_SERIF' as const,
          childrenIds: ['row-1', 'row-2', 'row-3'],
        },
      };
      const parsed = EmailLayoutBlockSchema.parse(input);
      expect(parsed).toEqual(input);
    });

    it('rejects invalid data properties', () => {
      const result = EmailLayoutBlockSchema.safeParse({
        type: 'EmailLayout',
        data: {
          fontFamily: 'InvalidFont',
        },
      });
      expect(result.success).toBe(false);
    });

    it('rejects missing data', () => {
      const result = EmailLayoutBlockSchema.safeParse({
        type: 'EmailLayout',
      });
      expect(result.success).toBe(false);
    });

    it('ignores extra properties in data', () => {
      const parsed = EmailLayoutBlockSchema.parse({
        type: 'EmailLayout',
        data: {
          extraProperty: 'should be ignored',
          anotherExtra: 123,
        },
      });
      expect(parsed.data).not.toHaveProperty('extraProperty');
      expect(parsed.data).not.toHaveProperty('anotherExtra');
    });
  });
});
