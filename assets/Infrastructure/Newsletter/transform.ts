/**
 * Newsletter/transform.ts - Data Transformation Layer
 *
 * Handles the transformation between the frontend editor format
 * and the HubDB API format. This is the single point of conversion
 * for newsletter data.
 *
 * Why Transform?
 * --------------
 * The editor uses a nested object structure optimized for React:
 * ```ts
 * {
 *   "root": { type: "EmailLayout", data: { ... } },
 *   "block-1": { type: "Text", data: { ... } }
 * }
 * ```
 *
 * HubDB requires flat rows with string values:
 * ```ts
 * [
 *   { blockId: "root", blockType: "EmailLayout", blockData: "{...}" },
 *   { blockId: "block-1", blockType: "Text", blockData: "{...}" }
 * ]
 * ```
 *
 * This module bridges that gap while enforcing size limits
 * and validating the payload structure.
 *
 * @module Infrastructure/Newsletter
 */
import type { TEditorConfiguration } from '@/Application/components/Editor/editor-core';
import type { NewsletterTypes } from './types';
import { newsletterSchemas } from './types';

/** Maximum payload size in characters (HubDB API limit) */
const MAX_PAYLOAD_SIZE = 1000000;

/**
 * Newsletter data transformation utilities.
 */
export const newsletterTransform = {
  /**
   * Convert editor configuration to HubDB payload format.
   *
   * Transformation steps:
   * 1. Flatten the keyed object into an array of rows
   * 2. Serialize block data to JSON strings
   * 3. Validate payload size against API limits
   * 4. Validate structure against Zod schema
   *
   * @param editorConfig The editor document configuration
   * @returns Validated payload ready for the API
   * @throws Error if payload exceeds size limit
   */
  toPayload: (editorConfig: TEditorConfiguration): NewsletterTypes['NewsletterPayload'] => {
    // Transform keyed object to array of HubDB rows
    const rows = Object.entries(editorConfig).map(([blockId, block]) => ({
      blockId,
      blockType: block.type,
      blockData: JSON.stringify(block.data), // Serialize data as JSON string
    }));

    const payload = { hubdbRows: rows };
    const payloadString = JSON.stringify(payload);

    // Enforce HubDB API size limits
    if (payloadString.length >= MAX_PAYLOAD_SIZE) {
      throw new Error(`Payload size exceeds ${MAX_PAYLOAD_SIZE} characters`);
    }

    // Validate and return the typed payload
    return newsletterSchemas.newsletterPayload.parse(payload);
  }
};