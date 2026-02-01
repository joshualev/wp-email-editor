import { z } from 'zod';
import { LAYOUT_SCHEMA } from '../helpers/layout';

// Constants for column width constraints
const TOTAL_WIDTH = 600;
const MIN_WIDTH = 150;
const WIDTH_STEP = 50;
const MAX_COLUMNS = 4;

// Vertical alignment values for content within columns
const VERTICAL_ALIGN_VALUES = ['top', 'middle', 'baseline'] as const;

// Schema for column widths with validation rules
export const COLUMNS_WIDTHS_SCHEMA = z
  .array(z.number().nonnegative())
  .refine(
    (widths) => {
      const sum = widths.reduce((acc, width) => acc + width, 0);
      return sum === TOTAL_WIDTH;
    },
    { message: `Active column widths must sum to exactly ${TOTAL_WIDTH}px` }
  )
  .refine(
    (widths) => widths.every((width) => width >= MIN_WIDTH && width % WIDTH_STEP === 0),
    {
      message: `Column widths must be in steps of ${WIDTH_STEP}px and at least ${MIN_WIDTH}px`,
    }
  );

// Complete schema for the Columns Container block
export const COLUMNS_CONTAINER_SCHEMA = z.object({
  type: z.literal('ColumnsContainer'),
  data: z.object({
    fullWidth: z.boolean().default(false),
    widths: COLUMNS_WIDTHS_SCHEMA,
    childrenIds: z
      .array(z.array(z.string()))
      .length(MAX_COLUMNS)
      .default([...Array(MAX_COLUMNS)].map(() => [])),
    contentAlignment: z.enum(VERTICAL_ALIGN_VALUES).default('middle'),
    layout: LAYOUT_SCHEMA
  }),
});