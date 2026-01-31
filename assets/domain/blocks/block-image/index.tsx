/**
 * block-image/index.tsx - Image Block Schema + Defaults
 *
 * Schema: ImageBlockSchema (from ./schema.ts)
 * - type: 'Image' (discriminator)
 * - data.image: URL, alt text, dimensions, alignment, link
 * - data.layout: Padding and background
 *
 * @module domain/blocks/block-image
 */
import { z } from 'zod';
import { IMAGE_BLOCK_SCHEMA } from './schema';

export const ImageBlockSchema = IMAGE_BLOCK_SCHEMA;
export const ImageBlockPropsSchema = IMAGE_BLOCK_SCHEMA.shape.data;
export type ImageBlockType = z.infer<typeof ImageBlockSchema>;
export type ImageBlockPropsType = z.infer<typeof ImageBlockPropsSchema>;

export const ImageBlockPropsDefaults: ImageBlockPropsType = {
  hidden: false,
  layout: {
    padding: { top: 5, right: 10, bottom: 5, left: 10 },
    background: { color: 'transparent' },
  },
  image: {
    url: 'https://placehold.co/600x450',
    alt: 'Image Block',
    aspectRatio: 'square',
    linkUrl: '',
    width: 300,
    height: undefined,
    alignment: {
      horizontal: {
        desktop: 'left',
        mobile: 'center',
      },
      vertical: 'middle',
    },
    borderRadius: 'small',
  },
};
