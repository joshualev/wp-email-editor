import { describe, expect, it } from 'vitest';

import { POST_BLOCK_SCHEMA } from '@/Domain/Blocks/block-post/schema';

describe('BlogPost block schema', () => {
  it('applies defaults and accepts a minimal valid component', () => {
    const parsed = POST_BLOCK_SCHEMA.parse({
      type: 'BlogPost',
      data: {
        components: [
          {
            type: 'Text',
            data: {
              typography: {},
              layout: {
                background: {}
              }
            }
          }
        ]
      }
    });

    expect(parsed.data.wordpressId).toBe('');
    expect(parsed.data.postType).toBe('post');
    expect(parsed.data.components).toHaveLength(1);
    expect(parsed.data.components[0].type).toBe('Text');
  });

  it('rejects empty components array', () => {
    const result = POST_BLOCK_SCHEMA.safeParse({
      type: 'BlogPost',
      data: {
        components: []
      }
    });

    expect(result.success).toBe(false);
  });
});
