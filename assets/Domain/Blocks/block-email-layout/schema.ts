/**
 * block-email-layout/schema.ts - Email Layout Root Block Schema
 *
 * Defines the root container block that wraps all email content.
 * This is the 'root' block in every newsletter document and controls
 * global styling that affects all child blocks.
 *
 * Properties:
 * - backdropColor: Background behind the 600px email canvas
 * - canvasColor: Background of the 600px content area
 * - textColor: Default text color for child blocks
 * - fontFamily: Default font family for child blocks
 * - childrenIds: Ordered list of top-level block IDs
 *
 * Document Structure:
 * The EmailLayout block is always stored with id 'root' and its
 * childrenIds define the order of blocks in the email.
 *
 * @module Domain/Blocks/block-email-layout
 */
import { z } from 'zod';
import { FONT_FAMILY_SCHEMA, COLOR_SCHEMA } from '@/Domain/Blocks/helpers/typography';

export const EmailLayoutBlockPropsSchema = z.object({
  backdropColor: COLOR_SCHEMA.default('#F5F5F5'),
  canvasColor: COLOR_SCHEMA.default('#FFFFFF'),
  textColor: COLOR_SCHEMA.default('#262626'),
  fontFamily: FONT_FAMILY_SCHEMA.default('MODERN_SANS'),
  childrenIds: z.array(z.string()).default([]),
});

export const EmailLayoutBlockSchema = z.object({
  type: z.literal('EmailLayout'),
  data: EmailLayoutBlockPropsSchema,
});

export type EmailLayoutBlockType = z.infer<typeof EmailLayoutBlockSchema>;
export type EmailLayoutBlockPropsType = z.infer<typeof EmailLayoutBlockPropsSchema>;
