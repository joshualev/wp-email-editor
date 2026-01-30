/**
 * block-text/index.tsx - Text Block Component
 *
 * Renders a paragraph text block with configurable typography and layout.
 * Used for body text, descriptions, and general text content in emails.
 *
 * Features:
 * - Responsive text alignment (desktop vs mobile)
 * - Configurable font family, size, weight, and color
 * - Padding and background color controls
 * - Hidden state for conditional visibility
 *
 * Schema: TextBlockSchema
 * - type: 'Text' (discriminator)
 * - data.content: String text content
 * - data.typography: Font settings (uses TYPOGRAPHY_SCHEMA)
 * - data.layout: Padding and background (uses LAYOUT_SCHEMA)
 * - data.hidden: Boolean visibility toggle
 *
 * @module Domain/Blocks/block-text
 */
import React, { CSSProperties } from 'react';
import { z } from 'zod';
import { TEXT_SIZE_VALUES, getResponsiveTextAlign } from '../helpers/typography';
import { getPadding, getFontFamily } from '../helpers/utils';

import { TYPOGRAPHY_SCHEMA } from '../helpers/typography';
import { LAYOUT_SCHEMA } from '../helpers/layout';

export const TextBlockSchema = z.object({
  type: z.literal('Text'),
  data: z.object({
    content: z.string().default(''),
    typography: TYPOGRAPHY_SCHEMA,
    layout: LAYOUT_SCHEMA,
    hidden: z.boolean().default(false),
  }),
});

export const TextBlockPropsSchema = TextBlockSchema.shape.data;
export type TextBlockType = z.infer<typeof TextBlockSchema>;
export type TextBlockPropsType = z.infer<typeof TextBlockPropsSchema>;

export const TextBlockPropsDefaults: TextBlockPropsType = {
  content: 'Example Paragraph Text',
  typography: {
    fontFamily: 'MODERN_SANS',
    fontWeight: 'normal',
    fontSize: 'm',
    textAlign: {
      desktop: 'left',
      mobile: 'center'
    },
    color: '#999999'
  },
  layout: {
    padding: { top: 5, right: 20, bottom: 10, left: 20 },
    background: {
      color: 'transparent'
    }
  },
  hidden: false,
};

function getTextSize(size: TextBlockPropsType['typography']['fontSize']): number {
  if (typeof size === 'number') return size;
  return TEXT_SIZE_VALUES[size];
}

interface TextBlockRenderProps extends TextBlockPropsType {
  isMobile?: boolean;
}

export function TextBlock({ content, typography, layout, isMobile = false }: TextBlockRenderProps) {
  const outerPadding = getPadding(layout.padding);
  const textAlign = getResponsiveTextAlign(typography.textAlign, isMobile);

  const textStyle: CSSProperties = {
    color: typography.color,
    fontSize: getTextSize(typography.fontSize),
    fontFamily: getFontFamily(typography.fontFamily),
    fontWeight: typography.fontWeight,
    textAlign,
    margin: 0,
  };

  const containerStyle: CSSProperties = {
    padding: outerPadding,
    backgroundColor: layout.background.color,
  };

  return (
    <div style={containerStyle}>
      <p style={textStyle}>{content}</p>
    </div>
  );
}