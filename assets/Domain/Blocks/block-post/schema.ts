import { z } from 'zod';

import { IMAGE_BLOCK_SCHEMA } from '../block-image/schema';
import { HEADING_BLOCK_SCHEMA } from '../block-heading/schema';
import { TEXT_BLOCK_SCHEMA } from '../block-text/schema';
import { BUTTON_BLOCK_SCHEMA } from '../block-button/schema';

const PostComponentSchema = z.discriminatedUnion('type', [
  IMAGE_BLOCK_SCHEMA,
  HEADING_BLOCK_SCHEMA,
  TEXT_BLOCK_SCHEMA,
  BUTTON_BLOCK_SCHEMA
]);

export const POST_BLOCK_SCHEMA = z.object({
  type: z.literal('BlogPost'),
  data: z.object({
    wordpressId: z.string().default(''),
    postType: z.string().default('post'),
    components: z.array(PostComponentSchema).min(1),
  }),
});