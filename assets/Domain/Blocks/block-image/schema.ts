import { z } from 'zod';
import { ALIGNMENT_SCHEMA } from '../helpers/layout';
import { LAYOUT_SCHEMA } from '../helpers/layout';

export const IMAGE_ASPECT_RATIO = {
  square: 1,
  landscape: 1.5,
  portrait: 0.667,
  wide: 1.778,
} as const;

export const IMAGE_BLOCK_PROPS_SCHEMA = z.object({
  url: z.string().url(),
  alt: z.string(),
  linkUrl: z.string().url().or(z.literal('')).optional(),
  width: z.number().positive(),
  height: z.number().positive().optional(),
  aspectRatio: z.union([
    z.enum(['square', 'landscape', 'portrait', 'wide']),
    z.number().positive(),
  ]).default('square'),
  alignment: ALIGNMENT_SCHEMA,
  borderRadius: z.enum(['none', 'small', 'medium', 'large', 'full']).default('none'),
});

export const IMAGE_BLOCK_SCHEMA = z.object({
  type: z.literal('Image'),
  data: z.object({
    image: IMAGE_BLOCK_PROPS_SCHEMA,
    layout: LAYOUT_SCHEMA,
    hidden: z.boolean().default(false),
  }),
});

export type ImageBlockType = z.infer<typeof IMAGE_BLOCK_SCHEMA>;
export type ImageBlockPropsType = z.infer<typeof IMAGE_BLOCK_SCHEMA.shape.data>;
export type ImageAspectRatioType = z.infer<typeof IMAGE_BLOCK_PROPS_SCHEMA.shape.aspectRatio>;
export type ImageBorderRadiusType = z.infer<typeof IMAGE_BLOCK_PROPS_SCHEMA.shape.borderRadius>;
export type ImageAlignmentType = z.infer<typeof IMAGE_BLOCK_PROPS_SCHEMA.shape.alignment>;