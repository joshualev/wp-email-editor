/**
 * block-heading/index.tsx - Heading Block Component
 *
 * Renders semantic heading elements (h1-h6) with configurable typography.
 * Used for titles, section headers, and emphasized text in emails.
 *
 * Features:
 * - Semantic HTML heading tags (h1-h6)
 * - Larger font size scale than text blocks (HEADING_SIZE_VALUES)
 * - Responsive text alignment (desktop vs mobile)
 * - Full typography and layout customization
 *
 * Schema: HeadingBlockSchema (from ./schema.ts)
 * - type: 'Heading' (discriminator)
 * - data.content: Heading text
 * - data.headingType: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
 * - data.typography: Font settings with heading-specific sizes
 * - data.layout: Padding and background
 *
 * @module Domain/Blocks/block-heading
 */
import React, { CSSProperties } from 'react';
import { z } from 'zod';
import { HEADING_BLOCK_SCHEMA } from './schema';
import { HEADING_SIZE_VALUES, getResponsiveTextAlign } from '../helpers/typography';
import { getPadding, getFontFamily } from '../helpers/utils';

export const HeadingBlockSchema = HEADING_BLOCK_SCHEMA;
export const HeadingBlockPropsSchema = HEADING_BLOCK_SCHEMA.shape.data;
export type HeadingBlockType = z.infer<typeof HeadingBlockSchema>;
export type HeadingBlockPropsType = z.infer<typeof HeadingBlockPropsSchema>;

export const HeadingBlockPropsDefaults: HeadingBlockPropsType = {
  content: 'Example Heading',
  headingType: "h2",
  typography: {
    fontFamily: 'MODERN_SANS',
    fontWeight: 'normal',
    fontSize: 'm',
    textAlign: {
      desktop: 'left',
      mobile: 'center'
    },
    color: '#111111'
  },
  layout: {
    padding: { top: 5, right: 20, bottom: 5, left: 20 },
    background: {
      color: 'transparent'
    }
  },
  hidden: false,
};

function getHeadingSize(size: HeadingBlockPropsType['typography']['fontSize']): number {
  if (typeof size === 'number') return size;
  return HEADING_SIZE_VALUES[size];
}

interface HeadingBlockRenderProps extends HeadingBlockPropsType {
  isMobile?: boolean;
}

export function HeadingBlock({ content, headingType, typography, layout, isMobile = false }: HeadingBlockRenderProps) {
  const outerPadding = getPadding(layout.padding);
  const textAlign = getResponsiveTextAlign(typography.textAlign, isMobile);

  const headingStyle: CSSProperties = {
    color: typography.color,
    fontSize: getHeadingSize(typography.fontSize),
    fontFamily: getFontFamily(typography.fontFamily),
    fontWeight: typography.fontWeight,
    textAlign,
    margin: 0,
  };

  const containerStyle: CSSProperties = {
    padding: outerPadding,
    backgroundColor: layout.background.color,
  };

  const Component = headingType;
  return (
    <div style={containerStyle}>
      <Component style={headingStyle}>{content}</Component>
    </div>
  );
}