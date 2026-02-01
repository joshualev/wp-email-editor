import React, { CSSProperties } from 'react';

import { HubSpotFooterBlockPropsType } from '@/domain/blocks/block-hubspot-footer';

export function HubSpotFooterBlock({ fullWidth, backgroundColor }: HubSpotFooterBlockPropsType) {
  const wrapperStyle: CSSProperties = fullWidth
    ? {
        backgroundColor,
        width: '100%',
      }
    : {};

  const containerStyle: CSSProperties = {
    backgroundColor: fullWidth ? 'transparent' : backgroundColor,
    padding: '20px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto',
    boxSizing: 'border-box' as const,
  };

  const textStyle: CSSProperties = {
    color: '#999',
    fontSize: '12px',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const content = (
    <div style={containerStyle}>
      <span style={textStyle}>HubSpot Footer</span>
    </div>
  );

  if (fullWidth) {
    return <div style={wrapperStyle}>{content}</div>;
  }

  return content;
}
