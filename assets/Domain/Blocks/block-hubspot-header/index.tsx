/**
 * block-hubspot-header/index.tsx - HubSpot Header Placeholder
 *
 * Renders a placeholder for HubSpot's email header module.
 * In the editor, displays a visual indicator; in production,
 * HubSpot replaces this with actual header content.
 *
 * HubSpot Integration:
 * - Maps to HubSpot's built-in header module
 * - Supports full-width background extension
 * - Background color syncs to HubSpot template
 *
 * Features:
 * - fullWidth: Extends background to email edges
 * - backgroundColor: Header background color
 *
 * Note: This is an editor placeholder only. The actual header
 * content (logo, navigation, etc.) is configured in HubSpot.
 *
 * Schema: HubSpotHeaderBlockSchema (from ./schema.ts)
 * - type: 'HubSpotHeader' (discriminator)
 * - data.fullWidth: Boolean edge-to-edge mode
 * - data.backgroundColor: Hex color string
 *
 * @module Domain/Blocks/block-hubspot-header
 */
import React, { CSSProperties } from 'react';
import { z } from 'zod';
import { HUBSPOT_HEADER_SCHEMA } from './schema';

export const HubSpotHeaderBlockSchema = HUBSPOT_HEADER_SCHEMA;
export const HubSpotHeaderBlockPropsSchema = HUBSPOT_HEADER_SCHEMA.shape.data;
export type HubSpotHeaderBlockType = z.infer<typeof HubSpotHeaderBlockSchema>;
export type HubSpotHeaderBlockPropsType = z.infer<typeof HubSpotHeaderBlockPropsSchema>;

export function HubSpotHeaderBlock({ fullWidth, backgroundColor }: HubSpotHeaderBlockPropsType) {
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
      <span style={textStyle}>HubSpot Header</span>
    </div>
  );

  if (fullWidth) {
    return <div style={wrapperStyle}>{content}</div>;
  }

  return content;
}
