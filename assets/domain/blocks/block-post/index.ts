/**
 * block-post/index.ts - Blog Post Block Schema + Defaults
 *
 * Schema: BlogPostBlockSchema (from ./schema.ts)
 * - type: 'BlogPost' (discriminator)
 * - data.wordpressId: WordPress post ID string
 * - data.postType: WordPress post type
 * - data.components: Array of Image/Heading/Text/Button blocks
 *
 * @module domain/blocks/block-post
 */
import { z } from 'zod';

import { POST_BLOCK_SCHEMA } from './schema';

import { ImageBlockPropsDefaults } from '../block-image';
import { HeadingBlockPropsDefaults } from '../block-heading';
import { TextBlockPropsDefaults } from '../block-text';
import { ButtonBlockPropsDefaults } from '../block-button';

export const BlogPostBlockSchema = POST_BLOCK_SCHEMA;
export const BlogPostBlockPropsSchema = POST_BLOCK_SCHEMA.shape.data;
export type BlogPostBlockType = z.infer<typeof BlogPostBlockSchema>;
export type BlogPostBlockPropsType = z.infer<typeof BlogPostBlockPropsSchema>;

export const BlogPostBlockPropsDefaults: BlogPostBlockPropsType = {
  wordpressId: '',
  postType: '',
  components: [
    {
      type: 'Image',
      data: ImageBlockPropsDefaults,
    },
    {
      type: 'Heading',
      data: HeadingBlockPropsDefaults,
    },
    {
      type: 'Text',
      data: TextBlockPropsDefaults,
    },
    {
      type: 'Button',
      data: ButtonBlockPropsDefaults,
    },
  ],
};
