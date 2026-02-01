import React, { CSSProperties } from 'react';

import { ColumnsContainerBlockPropsType } from '@/domain/blocks/block-columns-container';
import { getPadding } from '@/domain/blocks/helpers/utils';

// Map contentAlignment values to CSS justifyContent values
function getJustifyContent(alignment: 'top' | 'middle' | 'baseline'): CSSProperties['justifyContent'] {
  switch (alignment) {
    case 'top':
      return 'flex-start';
    case 'middle':
      return 'center';
    case 'baseline':
      return 'flex-end';
    default:
      return 'flex-start';
  }
}

export function ColumnsContainerBlock({
  widths,
  layout,
  contentAlignment,
  fullWidth,
  children,
  isMobile = false,
  defaultBackgroundColor,
}: ColumnsContainerBlockPropsType & { children: React.ReactNode[]; isMobile?: boolean; defaultBackgroundColor?: string }) {
  const effectiveBackgroundColor = (!fullWidth && layout.background.color === 'transparent' && defaultBackgroundColor)
    ? defaultBackgroundColor
    : layout.background.color;

  const wrapperStyle: CSSProperties = fullWidth
    ? {
      backgroundColor: layout.background.color,
      width: '100%',
    }
    : {};

  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    padding: getPadding(layout.padding),
    backgroundColor: fullWidth ? 'transparent' : effectiveBackgroundColor,
    width: isMobile ? '100%' : '600px',
    margin: '0 auto',
  };

  const content = (
    <div style={containerStyle} className="section">
      {children.map((columnContent, index) =>
        widths[index] > 0 ? (
          <div
            key={index}
            style={{
              width: isMobile ? '100%' : `${widths[index]}px`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: getJustifyContent(contentAlignment),
              minHeight: '100px',
            }}
          >
            {columnContent}
          </div>
        ) : null
      )}
    </div>
  );

  if (fullWidth) {
    return <div style={wrapperStyle}>{content}</div>;
  }

  return content;
}
