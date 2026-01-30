import { z } from 'zod';
import { TYPOGRAPHY_SCHEMA } from '../helpers/typography';
import { LAYOUT_SCHEMA } from '../helpers/layout';


// Padding multiplier for button sizes based on font size
export const BUTTON_PADDING_RATIO = {
  horizontal: 2, // Multiply font size by 2 for left/right padding
  vertical: 0.75 // Multiply font size by 0.75 for top/bottom padding
} as const;

export const BUTTON_VARIANT_SCHEMA = z.enum([
  'rectangle',
  'pill',
  'rounded'
]).default('rounded');


export const BUTTON_BLOCK_SCHEMA = z.object({
  type: z.literal('Button'),
  data: z.object({
    content: z.string().default('Click Here'),
    button: z.object({
      variant: BUTTON_VARIANT_SCHEMA,
      fullWidth: z.boolean().default(false),
      url: z.string().default('#'),
    }),
    typography: TYPOGRAPHY_SCHEMA,
    layout: LAYOUT_SCHEMA,
    hidden: z.boolean().default(false),
  }),
});