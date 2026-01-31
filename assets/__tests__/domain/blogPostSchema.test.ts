import { describe, expect, it } from 'vitest';

import { POST_BLOCK_SCHEMA } from '@/Domain/Blocks/block-post/schema';
import { TEXT_BLOCK_SCHEMA } from '@/Domain/Blocks/block-text/schema';
import { HEADING_BLOCK_SCHEMA } from '@/Domain/Blocks/block-heading/schema';
import { IMAGE_BLOCK_SCHEMA } from '@/Domain/Blocks/block-image/schema';
import { BUTTON_BLOCK_SCHEMA } from '@/Domain/Blocks/block-button/schema';

const createValidTextComponent = () => ({
  type: 'Text' as const,
  data: {
    typography: {},
    layout: { background: {} },
  },
});

const createValidHeadingComponent = () => ({
  type: 'Heading' as const,
  data: {
    typography: {},
    layout: { background: {} },
  },
});

const createValidImageComponent = () => ({
  type: 'Image' as const,
  data: {
    image: {
      url: 'https://example.com/image.jpg',
      alt: 'Test image',
      width: 300,
      alignment: {
        horizontal: { desktop: 'center', mobile: 'center' },
      },
    },
    layout: { background: {} },
  },
});

const createValidButtonComponent = () => ({
  type: 'Button' as const,
  data: {
    button: {},
    typography: {},
    layout: { background: {} },
  },
});

describe('POST_BLOCK_SCHEMA', () => {
  describe('valid blocks', () => {
    it('accepts minimal valid block with single Text component', () => {
      const parsed = POST_BLOCK_SCHEMA.parse({
        type: 'BlogPost',
        data: {
          components: [createValidTextComponent()],
        },
      });

      expect(parsed.type).toBe('BlogPost');
      expect(parsed.data.wordpressId).toBe('');
      expect(parsed.data.postType).toBe('post');
      expect(parsed.data.components).toHaveLength(1);
      expect(parsed.data.components[0].type).toBe('Text');
    });

    it('accepts block with all component types', () => {
      const parsed = POST_BLOCK_SCHEMA.parse({
        type: 'BlogPost',
        data: {
          components: [
            createValidImageComponent(),
            createValidHeadingComponent(),
            createValidTextComponent(),
            createValidButtonComponent(),
          ],
        },
      });

      expect(parsed.data.components).toHaveLength(4);
      expect(parsed.data.components.map((c) => c.type)).toEqual([
        'Image',
        'Heading',
        'Text',
        'Button',
      ]);
    });

    it('accepts block with custom wordpressId and postType', () => {
      const parsed = POST_BLOCK_SCHEMA.parse({
        type: 'BlogPost',
        data: {
          wordpressId: '12345',
          postType: 'tribe_events',
          components: [createValidTextComponent()],
        },
      });

      expect(parsed.data.wordpressId).toBe('12345');
      expect(parsed.data.postType).toBe('tribe_events');
    });

    it('accepts multiple components of the same type', () => {
      const parsed = POST_BLOCK_SCHEMA.parse({
        type: 'BlogPost',
        data: {
          components: [
            createValidTextComponent(),
            createValidTextComponent(),
            createValidTextComponent(),
          ],
        },
      });

      expect(parsed.data.components).toHaveLength(3);
      expect(parsed.data.components.every((c) => c.type === 'Text')).toBe(true);
    });
  });

  describe('type literal enforcement', () => {
    it('requires type to be exactly "BlogPost"', () => {
      const result = POST_BLOCK_SCHEMA.safeParse({
        type: 'BlogPost',
        data: {
          components: [createValidTextComponent()],
        },
      });
      expect(result.success).toBe(true);
    });

    it('rejects other type values', () => {
      const invalidTypes = ['Post', 'Article', 'WordPressPost', 'blog-post'];
      for (const type of invalidTypes) {
        const result = POST_BLOCK_SCHEMA.safeParse({
          type,
          data: { components: [createValidTextComponent()] },
        });
        expect(result.success).toBe(false);
      }
    });
  });

  describe('wordpressId validation', () => {
    it('defaults to empty string', () => {
      const parsed = POST_BLOCK_SCHEMA.parse({
        type: 'BlogPost',
        data: { components: [createValidTextComponent()] },
      });
      expect(parsed.data.wordpressId).toBe('');
    });

    it('accepts numeric string IDs', () => {
      const parsed = POST_BLOCK_SCHEMA.parse({
        type: 'BlogPost',
        data: {
          wordpressId: '999',
          components: [createValidTextComponent()],
        },
      });
      expect(parsed.data.wordpressId).toBe('999');
    });

    it('accepts alphanumeric IDs', () => {
      const parsed = POST_BLOCK_SCHEMA.parse({
        type: 'BlogPost',
        data: {
          wordpressId: 'post-abc-123',
          components: [createValidTextComponent()],
        },
      });
      expect(parsed.data.wordpressId).toBe('post-abc-123');
    });

    it('rejects non-string wordpressId', () => {
      const result = POST_BLOCK_SCHEMA.safeParse({
        type: 'BlogPost',
        data: {
          wordpressId: 12345,
          components: [createValidTextComponent()],
        },
      });
      expect(result.success).toBe(false);
    });
  });

  describe('postType validation', () => {
    it('defaults to "post"', () => {
      const parsed = POST_BLOCK_SCHEMA.parse({
        type: 'BlogPost',
        data: { components: [createValidTextComponent()] },
      });
      expect(parsed.data.postType).toBe('post');
    });

    it('accepts various post types', () => {
      const postTypes = ['post', 'whats-hot', 'sponsored_content', 'tribe_events', 'custom'];
      for (const postType of postTypes) {
        const result = POST_BLOCK_SCHEMA.safeParse({
          type: 'BlogPost',
          data: {
            postType,
            components: [createValidTextComponent()],
          },
        });
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.data.postType).toBe(postType);
        }
      }
    });

    it('rejects non-string postType', () => {
      const result = POST_BLOCK_SCHEMA.safeParse({
        type: 'BlogPost',
        data: {
          postType: 123,
          components: [createValidTextComponent()],
        },
      });
      expect(result.success).toBe(false);
    });
  });

  describe('components validation', () => {
    it('rejects empty components array', () => {
      const result = POST_BLOCK_SCHEMA.safeParse({
        type: 'BlogPost',
        data: { components: [] },
      });
      expect(result.success).toBe(false);
    });

    it('rejects missing components', () => {
      const result = POST_BLOCK_SCHEMA.safeParse({
        type: 'BlogPost',
        data: {},
      });
      expect(result.success).toBe(false);
    });

    it('rejects null components', () => {
      const result = POST_BLOCK_SCHEMA.safeParse({
        type: 'BlogPost',
        data: { components: null },
      });
      expect(result.success).toBe(false);
    });

    it('rejects invalid component types', () => {
      const invalidTypes = ['Divider', 'ColumnsContainer', 'BlogPost', 'EmailLayout'];
      for (const type of invalidTypes) {
        const result = POST_BLOCK_SCHEMA.safeParse({
          type: 'BlogPost',
          data: {
            components: [{ type, data: {} }],
          },
        });
        expect(result.success).toBe(false);
      }
    });

    it('rejects components with invalid data', () => {
      const result = POST_BLOCK_SCHEMA.safeParse({
        type: 'BlogPost',
        data: {
          components: [
            {
              type: 'Text',
              data: {
                typography: { fontSize: 5 }, // Below minimum
                layout: { background: {} },
              },
            },
          ],
        },
      });
      expect(result.success).toBe(false);
    });

    it('validates all components, not just first', () => {
      const result = POST_BLOCK_SCHEMA.safeParse({
        type: 'BlogPost',
        data: {
          components: [
            createValidTextComponent(),
            createValidHeadingComponent(),
            { type: 'InvalidType', data: {} }, // Invalid third component
          ],
        },
      });
      expect(result.success).toBe(false);
    });
  });

  describe('discriminated union validation', () => {
    it('correctly identifies Text components', () => {
      const parsed = POST_BLOCK_SCHEMA.parse({
        type: 'BlogPost',
        data: {
          components: [
            {
              type: 'Text',
              data: {
                content: 'Hello world',
                typography: { fontSize: 'l' },
                layout: { background: {} },
              },
            },
          ],
        },
      });

      const textComponent = parsed.data.components[0];
      expect(textComponent.type).toBe('Text');
      if (textComponent.type === 'Text') {
        expect(textComponent.data.content).toBe('Hello world');
        expect(textComponent.data.typography.fontSize).toBe('l');
      }
    });

    it('correctly identifies Heading components', () => {
      const parsed = POST_BLOCK_SCHEMA.parse({
        type: 'BlogPost',
        data: {
          components: [
            {
              type: 'Heading',
              data: {
                content: 'Main Title',
                headingType: 'h1',
                typography: {},
                layout: { background: {} },
              },
            },
          ],
        },
      });

      const headingComponent = parsed.data.components[0];
      expect(headingComponent.type).toBe('Heading');
      if (headingComponent.type === 'Heading') {
        expect(headingComponent.data.content).toBe('Main Title');
        expect(headingComponent.data.headingType).toBe('h1');
      }
    });

    it('correctly identifies Image components', () => {
      const parsed = POST_BLOCK_SCHEMA.parse({
        type: 'BlogPost',
        data: {
          components: [createValidImageComponent()],
        },
      });

      const imageComponent = parsed.data.components[0];
      expect(imageComponent.type).toBe('Image');
      if (imageComponent.type === 'Image') {
        expect(imageComponent.data.image.url).toBe('https://example.com/image.jpg');
        expect(imageComponent.data.image.width).toBe(300);
      }
    });

    it('correctly identifies Button components', () => {
      const parsed = POST_BLOCK_SCHEMA.parse({
        type: 'BlogPost',
        data: {
          components: [
            {
              type: 'Button',
              data: {
                content: 'Read More',
                button: { variant: 'pill', url: 'https://example.com' },
                typography: {},
                layout: { background: {} },
              },
            },
          ],
        },
      });

      const buttonComponent = parsed.data.components[0];
      expect(buttonComponent.type).toBe('Button');
      if (buttonComponent.type === 'Button') {
        expect(buttonComponent.data.content).toBe('Read More');
        expect(buttonComponent.data.button.variant).toBe('pill');
      }
    });
  });

  describe('component schema integration', () => {
    it('applies Text component defaults', () => {
      const parsed = POST_BLOCK_SCHEMA.parse({
        type: 'BlogPost',
        data: {
          components: [createValidTextComponent()],
        },
      });

      const textComponent = parsed.data.components[0];
      if (textComponent.type === 'Text') {
        expect(textComponent.data.content).toBe('');
        expect(textComponent.data.hidden).toBe(false);
        expect(textComponent.data.typography.fontSize).toBe('m');
      }
    });

    it('applies Heading component defaults', () => {
      const parsed = POST_BLOCK_SCHEMA.parse({
        type: 'BlogPost',
        data: {
          components: [createValidHeadingComponent()],
        },
      });

      const headingComponent = parsed.data.components[0];
      if (headingComponent.type === 'Heading') {
        expect(headingComponent.data.headingType).toBe('h2');
        expect(headingComponent.data.content).toBe('');
      }
    });

    it('applies Button component defaults', () => {
      const parsed = POST_BLOCK_SCHEMA.parse({
        type: 'BlogPost',
        data: {
          components: [createValidButtonComponent()],
        },
      });

      const buttonComponent = parsed.data.components[0];
      if (buttonComponent.type === 'Button') {
        expect(buttonComponent.data.content).toBe('Click Here');
        expect(buttonComponent.data.button.variant).toBe('rounded');
        expect(buttonComponent.data.button.fullWidth).toBe(false);
      }
    });
  });

  describe('edge cases', () => {
    it('handles many components', () => {
      const manyComponents = Array(20).fill(null).map(() => createValidTextComponent());
      const parsed = POST_BLOCK_SCHEMA.parse({
        type: 'BlogPost',
        data: { components: manyComponents },
      });
      expect(parsed.data.components).toHaveLength(20);
    });

    it('preserves component order', () => {
      const parsed = POST_BLOCK_SCHEMA.parse({
        type: 'BlogPost',
        data: {
          components: [
            { ...createValidHeadingComponent() },
            { ...createValidImageComponent() },
            { ...createValidTextComponent() },
            { ...createValidButtonComponent() },
          ],
        },
      });

      expect(parsed.data.components.map((c) => c.type)).toEqual([
        'Heading',
        'Image',
        'Text',
        'Button',
      ]);
    });
  });
});
