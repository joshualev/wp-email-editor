/**
 * block-hubspot-footer/index.ts - HubSpot Footer Schema
 *
 * Schema: HubSpotFooterBlockSchema (from ./schema.ts)
 * - type: 'HubSpotFooter' (discriminator)
 * - data.fullWidth: Boolean edge-to-edge mode
 * - data.backgroundColor: Hex color string
 *
 * @module domain/blocks/block-hubspot-footer
 */
import { z } from 'zod';
import { HUBSPOT_FOOTER_SCHEMA } from './schema';

export const HubSpotFooterBlockSchema = HUBSPOT_FOOTER_SCHEMA;
export const HubSpotFooterBlockPropsSchema = HUBSPOT_FOOTER_SCHEMA.shape.data;
export type HubSpotFooterBlockType = z.infer<typeof HubSpotFooterBlockSchema>;
export type HubSpotFooterBlockPropsType = z.infer<typeof HubSpotFooterBlockPropsSchema>;
