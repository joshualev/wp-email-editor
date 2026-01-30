/**
 * block-button/index.tsx - Button Block Component
 *
 * Renders call-to-action buttons with configurable styling and links.
 * Used for CTAs, navigation links, and action prompts in emails.
 *
 * Features:
 * - Three button variants: rectangle, rounded, pill
 * - Full-width or auto-width modes
 * - Dynamic padding based on font size (BUTTON_PADDING_RATIO)
 * - Responsive text alignment for container
 * - Custom background and text colors
 *
 * Styling Notes:
 * - Buttons render as <a> tags for email compatibility
 * - Full-width buttons span 100% and center text
 * - Auto-width buttons align within container
 *
 * Schema: ButtonBlockSchema (from ./schema.ts)
 * - type: 'Button' (discriminator)
 * - data.content: Button label text
 * - data.button: URL, fullWidth, variant
 * - data.typography: Font settings and text color
 * - data.layout: Padding and background (button color)
 *
 * @module Domain/Blocks/block-button
 */
import React, { CSSProperties } from 'react';
import { z } from 'zod';
import { BUTTON_PADDING_RATIO, BUTTON_BLOCK_SCHEMA } from './schema';
import { TEXT_SIZE_VALUES, getResponsiveTextAlign } from '../helpers/typography';
import { getPadding, getFontFamily, getBorderRadius } from '../helpers/utils';

export const ButtonBlockSchema = BUTTON_BLOCK_SCHEMA;
export const ButtonBlockPropsSchema = BUTTON_BLOCK_SCHEMA.shape.data;
export type ButtonBlockType = z.infer<typeof ButtonBlockSchema>;
export type ButtonBlockPropsType = z.infer<typeof ButtonBlockPropsSchema>;

export const ButtonBlockPropsDefaults: ButtonBlockPropsType = {
  content: 'Click here',
  button: {
    url: '#',
    fullWidth: false,
    variant: 'rounded'
  },
  typography: {
    fontFamily: 'MODERN_SANS',
    fontWeight: 'normal',
    fontSize: 'm',
    textAlign: {
      desktop: 'left',
      mobile: 'center'
    },
    color: '#ffffff'
  },
  layout: {
    padding: { top: 5, right: 20, bottom: 5, left: 20 },
    background: { color: '#000000' }
  },
  hidden: false,
};

interface ButtonBlockRenderProps extends ButtonBlockPropsType {
  isMobile?: boolean;
}

export function ButtonBlock({ content, button, typography, layout, isMobile = false }: ButtonBlockRenderProps) {
  const fontSize = typeof typography.fontSize === 'number'
    ? typography.fontSize
    : TEXT_SIZE_VALUES[typography.fontSize];

  const textAlign = getResponsiveTextAlign(typography.textAlign, isMobile);

  const buttonStyle: CSSProperties = {
    display: button.fullWidth ? 'block' : 'inline-block',
    width: button.fullWidth ? '100%' : 'auto',
    padding: `${fontSize * BUTTON_PADDING_RATIO.vertical}px ${fontSize * BUTTON_PADDING_RATIO.horizontal}px`,
    fontSize: `${fontSize}px`,
    fontFamily: getFontFamily(typography.fontFamily),
    fontWeight: typography.fontWeight,
    textAlign: button.fullWidth ? textAlign : 'center',
    color: typography.color,
    backgroundColor: layout.background.color,
    borderRadius: getBorderRadius('button', button.variant),
    textDecoration: 'none',
    border: 'none',
    cursor: 'pointer',
    transition: 'opacity 0.2s ease',
    margin: 0,
  };

  const containerStyle: CSSProperties = {
    padding: getPadding(layout.padding),
    textAlign: !button.fullWidth ? textAlign : undefined,
    display: 'block',
  };

  return (
    <div style={containerStyle}>
      <a
        href={button.url}
        style={buttonStyle}
      >
        {content}
      </a>
    </div>
  );
}