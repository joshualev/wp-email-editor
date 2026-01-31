import React from 'react';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { buildBlockConfigurationSchema } from '@/Domain/Document/buildBlockConfigurationSchema';
import { buildBlockConfigurationDictionary } from '@/Domain/Document/buildBlockConfigurationDictionary';
import { BlockNotFoundError } from '@/Domain/Document/utils';

const TextSchema = z.object({ text: z.string() });
const ImageSchema = z.object({ src: z.string() });

const TextComponent = ({ text }: { text: string }) => React.createElement('span', null, text);
const ImageComponent = ({ src }: { src: string }) => React.createElement('img', { src });

describe('document builders', () => {
  it('buildBlockConfigurationDictionary preserves the dictionary', () => {
    const dictionary = {
      Text: { schema: TextSchema, Component: TextComponent },
      Image: { schema: ImageSchema, Component: ImageComponent },
    };

    const result = buildBlockConfigurationDictionary(dictionary);
    expect(result).toBe(dictionary);
  });

  it('buildBlockConfigurationSchema validates known block types', () => {
    const dictionary = buildBlockConfigurationDictionary({
      Text: { schema: TextSchema, Component: TextComponent },
      Image: { schema: ImageSchema, Component: ImageComponent },
    });

    const schema = buildBlockConfigurationSchema(dictionary);
    const parsed = schema.parse({ type: 'Text', data: { text: 'Hello' } });

    expect(parsed).toEqual({ type: 'Text', data: { text: 'Hello' } });
  });

  it('buildBlockConfigurationSchema rejects unknown block types', () => {
    const dictionary = buildBlockConfigurationDictionary({
      Text: { schema: TextSchema, Component: TextComponent },
    });

    const schema = buildBlockConfigurationSchema(dictionary);
    const result = schema.safeParse({ type: 'Video', data: { url: 'x' } });

    expect(result.success).toBe(false);
  });

  it('BlockNotFoundError includes the missing block id', () => {
    const error = new BlockNotFoundError('missing-block');
    expect(error.message).toBe('Could not find a block with the given blockId');
    expect(error.blockId).toBe('missing-block');
  });
});
