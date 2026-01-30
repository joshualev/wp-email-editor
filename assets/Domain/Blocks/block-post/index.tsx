/**
 * block-post/index.tsx - Blog Post Block Component
 *
 * A composite block that renders WordPress blog post content using
 * a predefined component structure. Designed for newsletter feature articles.
 *
 * Component Structure (in order):
 * 1. Image - Featured image from WordPress post
 * 2. Heading - Post title
 * 3. Text - Post excerpt or summary
 * 4. Button - Read more link to full article
 *
 * WordPress Integration:
 * - wordpressId: Links to WordPress post ID for data sync
 * - postType: WordPress post type (post, page, custom)
 * - Component data can be synced via FetchLatestPostData action
 *
 * Schema: BlogPostBlockSchema
 * - type: 'BlogPost' (discriminator)
 * - data.wordpressId: WordPress post ID string
 * - data.postType: WordPress post type
 * - data.components: Array of Image/Heading/Text/Button blocks
 *
 * @module Domain/Blocks/block-post
 */
import { z } from 'zod';

import { ImageBlockSchema, ImageBlock } from '../block-image';
import { HeadingBlockSchema, HeadingBlock } from '../block-heading';
import { TextBlockSchema, TextBlock } from '../block-text';
import { ButtonBlockSchema, ButtonBlock } from '../block-button';

import { ImageBlockPropsDefaults } from '../block-image';
import { HeadingBlockPropsDefaults } from '../block-heading';
import { TextBlockPropsDefaults } from '../block-text';
import { ButtonBlockPropsDefaults } from '../block-button';

// Component schema for each type
const ComponentsBlockSchema = z.discriminatedUnion('type', [
  ImageBlockSchema,
  HeadingBlockSchema,
  TextBlockSchema,
  ButtonBlockSchema,
]);

// Main schema for BlogPost
export const BlogPostBlockSchema = z.object({
  type: z.literal('BlogPost'),
  data: z.object({
    wordpressId: z.string(),
    postType: z.string(),
    components: z.array(ComponentsBlockSchema).min(1),
  }),
});

export const BlogPostBlockPropsSchema = BlogPostBlockSchema.shape.data;
export type BlogPostBlockType = z.infer<typeof BlogPostBlockSchema>;
export type BlogPostBlockPropsType = z.infer<typeof BlogPostBlockPropsSchema>;


export const BlogPostBlockPropsDefaults: BlogPostBlockPropsType = {
  wordpressId: '',
  postType: '',
  components: [
    {
      type: 'Image',
      data: ImageBlockPropsDefaults
    },
    {
      type: 'Heading',
      data: HeadingBlockPropsDefaults
    },
    {
      type: 'Text',
      data: TextBlockPropsDefaults
    },
    {
      type: 'Button',
      data: ButtonBlockPropsDefaults
    },
  ]
}

interface BlogPostBlockRenderProps extends BlogPostBlockPropsType {
  isMobile?: boolean;
}

export function BlogPostBlock({ components, isMobile = false }: BlogPostBlockRenderProps) {

  return (
    <>
      {components.map((component, index) => {
        if (component.data.hidden) return null;

        switch (component.type) {
          case 'Image':
            return <ImageBlock key={index} {...component.data} isMobile={isMobile} />;
          case 'Heading':
            return <HeadingBlock key={index} {...component.data} isMobile={isMobile} />;
          case 'Text':
            return <TextBlock key={index} {...component.data} isMobile={isMobile} />;
          case 'Button':
            return <ButtonBlock key={index} {...component.data} isMobile={isMobile} />;
          default:
            return null;
        }
      })}
    </>
  );
}
