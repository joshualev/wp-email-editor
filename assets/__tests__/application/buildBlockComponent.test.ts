import React from 'react';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { buildBlockConfigurationDictionary } from '@/Domain/Document/buildBlockConfigurationDictionary';
import { buildBlockComponent } from '@/Application/components/Editor/buildBlockComponent';

const TextSchema = z.object({ text: z.string() });

const TextComponent = ({ text }: { text: string }) => React.createElement('span', null, text);

describe('buildBlockComponent', () => {
  it('renders the component registered for the block type', () => {
    const dictionary = buildBlockConfigurationDictionary({
      Text: {
        schema: TextSchema,
        Component: TextComponent,
      },
    });

    const BlockRenderer = buildBlockComponent(dictionary);
    const element = BlockRenderer({ type: 'Text', data: { text: 'Hello' } });

    expect(React.isValidElement(element)).toBe(true);
    expect(element.type).toBe(TextComponent);
    expect(element.props.text).toBe('Hello');
  });
});
