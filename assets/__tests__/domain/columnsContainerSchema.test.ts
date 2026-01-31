import { describe, expect, it } from 'vitest';

import {
  COLUMNS_CONTAINER_SCHEMA,
  COLUMNS_WIDTHS_SCHEMA,
} from '@/Domain/Blocks/block-columns-container/schema';

// These constants mirror the schema's internal constraints for test verification
const TOTAL_WIDTH = 600;
const MIN_WIDTH = 150;
const MAX_COLUMNS = 4;

describe('COLUMNS_WIDTHS_SCHEMA', () => {
  describe('valid configurations', () => {
    it('accepts single column at full width', () => {
      const result = COLUMNS_WIDTHS_SCHEMA.safeParse([600]);
      expect(result.success).toBe(true);
    });

    it('accepts two equal columns', () => {
      const result = COLUMNS_WIDTHS_SCHEMA.safeParse([300, 300]);
      expect(result.success).toBe(true);
    });

    it('accepts three equal columns', () => {
      const result = COLUMNS_WIDTHS_SCHEMA.safeParse([200, 200, 200]);
      expect(result.success).toBe(true);
    });

    it('accepts four equal columns', () => {
      const result = COLUMNS_WIDTHS_SCHEMA.safeParse([150, 150, 150, 150]);
      expect(result.success).toBe(true);
    });

    it('accepts asymmetric two-column layouts', () => {
      const validLayouts = [
        [450, 150],
        [400, 200],
        [350, 250],
        [150, 450],
        [200, 400],
      ];
      for (const layout of validLayouts) {
        const result = COLUMNS_WIDTHS_SCHEMA.safeParse(layout);
        expect(result.success).toBe(true);
      }
    });

    it('accepts asymmetric three-column layouts', () => {
      const validLayouts = [
        [300, 150, 150],
        [150, 300, 150],
        [150, 150, 300],
        [250, 200, 150],
      ];
      for (const layout of validLayouts) {
        const result = COLUMNS_WIDTHS_SCHEMA.safeParse(layout);
        expect(result.success).toBe(true);
      }
    });

    it('accepts all widths in 50px increments starting at minimum', () => {
      const validWidths = [150, 200, 250, 300, 350, 400, 450, 500, 550, 600];
      for (const width of validWidths) {
        const remaining = TOTAL_WIDTH - width;
        if (remaining === 0) {
          const result = COLUMNS_WIDTHS_SCHEMA.safeParse([width]);
          expect(result.success).toBe(true);
        } else if (remaining >= MIN_WIDTH) {
          const result = COLUMNS_WIDTHS_SCHEMA.safeParse([width, remaining]);
          expect(result.success).toBe(true);
        }
      }
    });
  });

  describe('sum constraint', () => {
    it('rejects widths that sum to less than 600', () => {
      const invalidLayouts = [
        [200, 200],          // 400
        [150, 150, 150],     // 450
        [100, 100, 100, 100], // 400
        [300],               // 300
      ];
      for (const layout of invalidLayouts) {
        const result = COLUMNS_WIDTHS_SCHEMA.safeParse(layout);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toContain('600');
        }
      }
    });

    it('rejects widths that sum to more than 600', () => {
      const invalidLayouts = [
        [350, 350],          // 700
        [250, 250, 250],     // 750
        [200, 200, 200, 200], // 800
      ];
      for (const layout of invalidLayouts) {
        const result = COLUMNS_WIDTHS_SCHEMA.safeParse(layout);
        expect(result.success).toBe(false);
      }
    });
  });

  describe('minimum width constraint', () => {
    it('rejects any column below 150px', () => {
      const invalidLayouts = [
        [500, 100],          // 100 < 150
        [450, 100, 50],      // 100 and 50 < 150
        [350, 200, 49, 1],   // 49 and 1 < 150
        [100, 100, 200, 200], // first two < 150
      ];
      for (const layout of invalidLayouts) {
        const result = COLUMNS_WIDTHS_SCHEMA.safeParse(layout);
        expect(result.success).toBe(false);
      }
    });

    it('rejects width of exactly 0', () => {
      const result = COLUMNS_WIDTHS_SCHEMA.safeParse([600, 0]);
      expect(result.success).toBe(false);
    });
  });

  describe('step constraint', () => {
    it('rejects widths not in 50px steps', () => {
      const invalidLayouts = [
        [325, 275],          // not 50px steps
        [175, 175, 250],     // 175 not a 50px step from 150
        [160, 220, 220],     // 160 and 220 not 50px steps
        [155, 445],          // neither is 50px step
      ];
      for (const layout of invalidLayouts) {
        const result = COLUMNS_WIDTHS_SCHEMA.safeParse(layout);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toContain('50px');
        }
      }
    });

    it('accepts boundary values at 50px steps', () => {
      // 150, 200, 250, 300, 350, 400, 450, 500, 550, 600 are valid
      expect(COLUMNS_WIDTHS_SCHEMA.safeParse([150, 450]).success).toBe(true);
      expect(COLUMNS_WIDTHS_SCHEMA.safeParse([200, 400]).success).toBe(true);
      expect(COLUMNS_WIDTHS_SCHEMA.safeParse([250, 350]).success).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('rejects empty array', () => {
      const result = COLUMNS_WIDTHS_SCHEMA.safeParse([]);
      expect(result.success).toBe(false);
    });

    it('rejects negative widths', () => {
      const result = COLUMNS_WIDTHS_SCHEMA.safeParse([700, -100]);
      expect(result.success).toBe(false);
    });

    it('rejects non-numeric values', () => {
      const result = COLUMNS_WIDTHS_SCHEMA.safeParse(['200', '400']);
      expect(result.success).toBe(false);
    });

    it('rejects null and undefined', () => {
      expect(COLUMNS_WIDTHS_SCHEMA.safeParse(null).success).toBe(false);
      expect(COLUMNS_WIDTHS_SCHEMA.safeParse(undefined).success).toBe(false);
    });

    it('rejects decimal widths even if valid step', () => {
      // 150.0 would be valid as integer, testing floats
      const result = COLUMNS_WIDTHS_SCHEMA.safeParse([300.5, 299.5]);
      expect(result.success).toBe(false);
    });
  });
});

describe('COLUMNS_CONTAINER_SCHEMA', () => {
  describe('valid complete blocks', () => {
    it('accepts minimal valid block with defaults', () => {
      const parsed = COLUMNS_CONTAINER_SCHEMA.parse({
        type: 'ColumnsContainer',
        data: {
          widths: [200, 200, 200],
          layout: { background: {} },
        },
      });

      expect(parsed.type).toBe('ColumnsContainer');
      expect(parsed.data.widths).toEqual([200, 200, 200]);
      expect(parsed.data.fullWidth).toBe(false);
      expect(parsed.data.childrenIds).toHaveLength(MAX_COLUMNS);
      expect(parsed.data.childrenIds.every((col) => Array.isArray(col) && col.length === 0)).toBe(true);
      expect(parsed.data.contentAlignment).toBe('middle');
    });

    it('accepts fully specified block', () => {
      const input = {
        type: 'ColumnsContainer',
        data: {
          fullWidth: true,
          widths: [300, 300],
          childrenIds: [['block-1', 'block-2'], ['block-3'], [], []],
          contentAlignment: 'top',
          layout: {
            padding: { top: 10, right: 20, bottom: 10, left: 20 },
            background: { color: '#EEEEEE' },
          },
        },
      };
      const parsed = COLUMNS_CONTAINER_SCHEMA.parse(input);
      expect(parsed.data.fullWidth).toBe(true);
      expect(parsed.data.childrenIds[0]).toEqual(['block-1', 'block-2']);
      expect(parsed.data.contentAlignment).toBe('top');
      expect(parsed.data.layout.padding).toEqual({ top: 10, right: 20, bottom: 10, left: 20 });
    });
  });

  describe('type literal enforcement', () => {
    it('rejects wrong type value', () => {
      const result = COLUMNS_CONTAINER_SCHEMA.safeParse({
        type: 'Row',
        data: { widths: [300, 300] },
      });
      expect(result.success).toBe(false);
    });

    it('rejects missing type', () => {
      const result = COLUMNS_CONTAINER_SCHEMA.safeParse({
        data: { widths: [300, 300] },
      });
      expect(result.success).toBe(false);
    });
  });

  describe('childrenIds validation', () => {
    it('defaults to four empty arrays', () => {
      const parsed = COLUMNS_CONTAINER_SCHEMA.parse({
        type: 'ColumnsContainer',
        data: {
          widths: [600],
          layout: { background: {} },
        },
      });
      expect(parsed.data.childrenIds).toEqual([[], [], [], []]);
      expect(parsed.data.childrenIds).toHaveLength(MAX_COLUMNS);
    });

    it('rejects childrenIds with wrong length', () => {
      const result = COLUMNS_CONTAINER_SCHEMA.safeParse({
        type: 'ColumnsContainer',
        data: {
          widths: [300, 300],
          childrenIds: [['a'], ['b']], // Only 2, needs 4
          layout: { background: {} },
        },
      });
      expect(result.success).toBe(false);
    });

    it('accepts childrenIds with block IDs in each column', () => {
      const parsed = COLUMNS_CONTAINER_SCHEMA.parse({
        type: 'ColumnsContainer',
        data: {
          widths: [150, 150, 150, 150],
          childrenIds: [
            ['text-1', 'image-1'],
            ['heading-1'],
            ['button-1', 'text-2', 'divider-1'],
            [],
          ],
          layout: { background: {} },
        },
      });
      expect(parsed.data.childrenIds[0]).toEqual(['text-1', 'image-1']);
      expect(parsed.data.childrenIds[2]).toHaveLength(3);
    });

    it('rejects non-string values in childrenIds', () => {
      const result = COLUMNS_CONTAINER_SCHEMA.safeParse({
        type: 'ColumnsContainer',
        data: {
          widths: [300, 300],
          childrenIds: [[123], [], [], []],
          layout: { background: {} },
        },
      });
      expect(result.success).toBe(false);
    });
  });

  describe('contentAlignment validation', () => {
    it('accepts all valid vertical alignment values', () => {
      const alignments = ['top', 'middle', 'baseline'] as const;
      for (const alignment of alignments) {
        const result = COLUMNS_CONTAINER_SCHEMA.safeParse({
          type: 'ColumnsContainer',
          data: {
            widths: [300, 300],
            contentAlignment: alignment,
            layout: { background: {} },
          },
        });
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.data.contentAlignment).toBe(alignment);
        }
      }
    });

    it('rejects invalid alignment values', () => {
      const invalidAlignments = ['center', 'bottom', 'stretch', ''];
      for (const alignment of invalidAlignments) {
        const result = COLUMNS_CONTAINER_SCHEMA.safeParse({
          type: 'ColumnsContainer',
          data: {
            widths: [300, 300],
            contentAlignment: alignment,
            layout: { background: {} },
          },
        });
        expect(result.success).toBe(false);
      }
    });
  });

  describe('layout schema integration', () => {
    it('applies default padding values', () => {
      const parsed = COLUMNS_CONTAINER_SCHEMA.parse({
        type: 'ColumnsContainer',
        data: {
          widths: [300, 300],
          layout: { background: {} },
        },
      });
      expect(parsed.data.layout.padding).toEqual({
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      });
    });

    it('applies default background color', () => {
      const parsed = COLUMNS_CONTAINER_SCHEMA.parse({
        type: 'ColumnsContainer',
        data: {
          widths: [300, 300],
          layout: { background: {} },
        },
      });
      expect(parsed.data.layout.background.color).toBe('transparent');
    });

    it('preserves custom layout values', () => {
      const parsed = COLUMNS_CONTAINER_SCHEMA.parse({
        type: 'ColumnsContainer',
        data: {
          widths: [300, 300],
          layout: {
            padding: { top: 24, right: 16, bottom: 24, left: 16 },
            background: { color: '#F0F0F0' },
          },
        },
      });
      expect(parsed.data.layout.padding).toEqual({
        top: 24,
        right: 16,
        bottom: 24,
        left: 16,
      });
      expect(parsed.data.layout.background.color).toBe('#F0F0F0');
    });
  });

  describe('fullWidth boolean', () => {
    it('defaults to false', () => {
      const parsed = COLUMNS_CONTAINER_SCHEMA.parse({
        type: 'ColumnsContainer',
        data: {
          widths: [300, 300],
          layout: { background: {} },
        },
      });
      expect(parsed.data.fullWidth).toBe(false);
    });

    it('accepts true', () => {
      const parsed = COLUMNS_CONTAINER_SCHEMA.parse({
        type: 'ColumnsContainer',
        data: {
          fullWidth: true,
          widths: [300, 300],
          layout: { background: {} },
        },
      });
      expect(parsed.data.fullWidth).toBe(true);
    });

    it('rejects non-boolean values', () => {
      const result = COLUMNS_CONTAINER_SCHEMA.safeParse({
        type: 'ColumnsContainer',
        data: {
          fullWidth: 'true',
          widths: [300, 300],
          layout: { background: {} },
        },
      });
      expect(result.success).toBe(false);
    });
  });
});
