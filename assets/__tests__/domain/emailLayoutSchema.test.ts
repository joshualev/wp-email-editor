import { describe, expect, it } from 'vitest';

import { EmailLayoutBlockPropsSchema } from '@/Domain/Blocks/block-email-layout/schema';


describe('EmailLayout block schema', () => {
  it('applies defaults for missing fields', () => {
    const parsed = EmailLayoutBlockPropsSchema.parse({});

    expect(parsed.backdropColor).toBe('#F5F5F5');
    expect(parsed.canvasColor).toBe('#FFFFFF');
    expect(parsed.textColor).toBe('#262626');
    expect(parsed.fontFamily).toBe('MODERN_SANS');
    expect(parsed.childrenIds).toEqual([]);
  });

  it('accepts provided values without mutation', () => {
    const parsed = EmailLayoutBlockPropsSchema.parse({
      backdropColor: '#111111',
      canvasColor: '#222222',
      textColor: '#333333',
      fontFamily: 'BOOK_SANS',
      childrenIds: ['a', 'b']
    });

    expect(parsed).toEqual({
      backdropColor: '#111111',
      canvasColor: '#222222',
      textColor: '#333333',
      fontFamily: 'BOOK_SANS',
      childrenIds: ['a', 'b']
    });
  });
});
