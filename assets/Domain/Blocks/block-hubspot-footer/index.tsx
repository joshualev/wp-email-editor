/**
 * block-hubspot-footer/index.tsx - HubSpot Footer Placeholder
 *
 * Renders a placeholder for HubSpot's email footer module.
 * In the editor, displays a visual indicator; in production,
 * HubSpot replaces this with required footer content.
 *
 * HubSpot Integration:
 * - Maps to HubSpot's built-in footer module
 * - Contains required elements: unsubscribe link, physical address
 * - Supports full-width background extension
 *
 * Features:
 * - fullWidth: Extends background to email edges
 * - backgroundColor: Footer background color
 *
 * CAN-SPAM Compliance:
 * HubSpot automatically includes required footer elements
 * (unsubscribe link, company address) in the actual email.
 *
 * Schema: HubSpotFooterBlockSchema (from ./schema.ts)
 * - type: 'HubSpotFooter' (discriminator)
 * - data.fullWidth: Boolean edge-to-edge mode
 * - data.backgroundColor: Hex color string
 *
 * @module Domain/Blocks/block-hubspot-footer
 */
import React, { CSSProperties } from 'react';
import { z } from 'zod';
import { HUBSPOT_FOOTER_SCHEMA } from './schema';

export const HubSpotFooterBlockSchema = HUBSPOT_FOOTER_SCHEMA;
export const HubSpotFooterBlockPropsSchema = HUBSPOT_FOOTER_SCHEMA.shape.data;
export type HubSpotFooterBlockType = z.infer<typeof HubSpotFooterBlockSchema>;
export type HubSpotFooterBlockPropsType = z.infer<typeof HubSpotFooterBlockPropsSchema>;

export function HubSpotFooterBlock({ fullWidth, backgroundColor }: HubSpotFooterBlockPropsType) {
  const wrapperStyle: CSSProperties = fullWidth ? {
    backgroundColor,
    width: '100%',
  } : {};

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
