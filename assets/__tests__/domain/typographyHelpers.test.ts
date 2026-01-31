import { describe, expect, it } from 'vitest';

import {
  FONT_SIZE_SCHEMA,
  RESPONSIVE_TEXT_ALIGN_SCHEMA,
  TEXT_ALIGN_SCHEMA,
  TYPOGRAPHY_SCHEMA,
  getResponsiveTextAlign
} from '@/Domain/Blocks/helpers/typography';

import { HORIZONTAL_ALIGN_VALUES } from '@/Domain/Blocks/helpers/layout';

describe('typography helpers', () => {
  it('coerces legacy textAlign string into responsive object with mobile default', () => {
    const parsed = RESPONSIVE_TEXT_ALIGN_SCHEMA.parse('right');
    expect(parsed).toEqual({ desktop: 'right', mobile: 'center' });
  });

  it('falls back to safe defaults for invalid responsive align input', () => {
    const parsed = RESPONSIVE_TEXT_ALIGN_SCHEMA.parse(42 as unknown);
    expect(parsed).toEqual({ desktop: 'left', mobile: 'center' });
  });

  it('returns correct alignment based on viewport', () => {
    const value = { desktop: 'left', mobile: 'right' } as const;
    expect(getResponsiveTextAlign(value, false)).toBe('left');
    expect(getResponsiveTextAlign(value, true)).toBe('right');
  });

  it('accepts enum sizes and custom numeric sizes within range', () => {
    const enumValue = FONT_SIZE_SCHEMA.parse('xl');
    expect(enumValue).toBe('xl');

    const numericValue = FONT_SIZE_SCHEMA.parse(32);
    expect(numericValue).toBe(32);

    const tooSmall = FONT_SIZE_SCHEMA.safeParse(10);
    const tooLarge = FONT_SIZE_SCHEMA.safeParse(100);
    expect(tooSmall.success).toBe(false);
    expect(tooLarge.success).toBe(false);
  });

  it('applies defaults in typography schema', () => {
    const parsed = TYPOGRAPHY_SCHEMA.parse({});
    expect(parsed.fontSize).toBe('m');
    expect(HORIZONTAL_ALIGN_VALUES).toContain(parsed.textAlign.desktop);
    expect(HORIZONTAL_ALIGN_VALUES).toContain(parsed.textAlign.mobile);
    expect(parsed.color).toBe('#000000');
  });

  it('keeps legacy single-value textAlign consistent with default schema', () => {
    const legacy = TEXT_ALIGN_SCHEMA.parse(undefined);
    expect(legacy).toBe('left');
  });
});
