import React, { CSSProperties } from 'react';

import { ButtonBlockPropsType } from '@/Domain/Blocks/block-button';
import { BUTTON_PADDING_RATIO } from '@/Domain/Blocks/block-button/schema';
import { TEXT_SIZE_VALUES, getResponsiveTextAlign } from '@/Domain/Blocks/helpers/typography';
import { getPadding, getFontFamily, getBorderRadius } from '@/Domain/Blocks/helpers/utils';

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
    maxWidth: '100%',
    padding: `${fontSize * BUTTON_PADDING_RATIO.vertical}px ${fontSize * BUTTON_PADDING_RATIO.horizontal}px`,
    fontSize: `${fontSize}px`,
    fontFamily: getFontFamily(typography.fontFamily),
    fontWeight: typography.fontWeight,
    textAlign: button.fullWidth ? textAlign : 'center',
    whiteSpace: 'normal',
    overflowWrap: 'anywhere',
    wordBreak: 'break-word',
    lineHeight: 1.2,
    boxSizing: 'border-box',
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
