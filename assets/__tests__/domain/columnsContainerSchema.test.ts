import { describe, expect, it } from 'vitest';

import { COLUMNS_CONTAINER_SCHEMA } from '@/Domain/Blocks/block-columns-container/schema';

const validWidths = [200, 200, 200];

describe('ColumnsContainer block schema', () => {
  it('accepts valid widths that sum to 600 and applies defaults', () => {
    const parsed = COLUMNS_CONTAINER_SCHEMA.parse({
      type: 'ColumnsContainer',
      data: {
        widths: validWidths,
        layout: {
          background: {}
        }
      }
    });

    expect(parsed.data.fullWidth).toBe(false);
    expect(parsed.data.widths).toEqual(validWidths);
    expect(parsed.data.childrenIds).toHaveLength(4);
    expect(parsed.data.childrenIds.every((col: string[]) => Array.isArray(col))).toBe(true);
    expect(parsed.data.contentAlignment).toBe('middle');
    expect(parsed.data.layout.padding).toEqual({ top: 0, right: 0, bottom: 0, left: 0 });
    expect(parsed.data.layout.background).toEqual({ color: 'transparent' });
  });

  it('rejects widths that do not sum to 600', () => {
    const result = COLUMNS_CONTAINER_SCHEMA.safeParse({
      type: 'ColumnsContainer',
      data: {
        widths: [150, 150, 150]
      }
    });

    expect(result.success).toBe(false);
  });

  it('rejects widths that are not in 50px steps or below minimum', () => {
    const result = COLUMNS_CONTAINER_SCHEMA.safeParse({
      type: 'ColumnsContainer',
      data: {
        widths: [160, 220, 220]
      }
    });

    expect(result.success).toBe(false);
  });
});
