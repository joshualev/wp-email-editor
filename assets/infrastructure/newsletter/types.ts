/**
 * newsletter/types.ts - Newsletter API Type Definitions
 *
 * Defines Zod schemas and TypeScript types for the newsletter API.
 * Using Zod provides both compile-time types and runtime validation.
 *
 * Schema Usage:
 * -------------
 * 1. Validate API payloads before sending
 * 2. Validate API responses after receiving
 * 3. Generate TypeScript types automatically
 *
 * @module infrastructure/newsletter
 */
import { z } from 'zod';

/*
|--------------------------------------------------------------------------
| HubDB Row Schema
|--------------------------------------------------------------------------
|
| Represents a single row in the HubDB table. Each block in the editor
| becomes one row in HubDB.
|
| Fields:
| - id: Row ID assigned by HubDB (optional, not present for new rows)
| - blockId: The editor's unique identifier for this block
| - blockType: The block type (e.g., "Text", "Image", "EmailLayout")
| - blockData: JSON string containing the block's configuration
|
*/
export const HubDBRowSchema = z.object({
  id: z.number().optional(),
  blockId: z.string(),
  blockType: z.string(),
  blockData: z.string(),
}).strict();

/*
|--------------------------------------------------------------------------
| Newsletter Payload Schema
|--------------------------------------------------------------------------
|
| The complete payload sent to the update endpoint.
| Contains an array of HubDB rows representing all blocks.
|
*/
export const NewsletterPayloadSchema = z.object({
  hubdbRows: z.array(HubDBRowSchema),
}).strict();

/*
|--------------------------------------------------------------------------
| Newsletter Create Params Schema
|--------------------------------------------------------------------------
|
| Parameters for creating a new HubDB table.
| - name: Internal table name (lowercase, no spaces)
| - label: Human-readable display name
|
*/
export const NewsletterCreateParamsSchema = z.object({
  name: z.string().min(1),
  label: z.string().min(1),
}).strict();

/**
 * Consolidated schemas object for convenient access.
 *
 * Usage:
 * ```ts
 * const validated = newsletterSchemas.newsletterPayload.parse(data);
 * ```
 */
export const newsletterSchemas = {
  hubDBRow: HubDBRowSchema,
  newsletterPayload: NewsletterPayloadSchema,
  createParams: NewsletterCreateParamsSchema,
} as const;

/**
 * Consolidated type exports for TypeScript usage.
 *
 * Usage:
 * ```ts
 * function saveNewsletter(payload: NewsletterTypes['NewsletterPayload']) { ... }
 * ```
 */
export type NewsletterTypes = {
  HubDBRow: z.infer<typeof HubDBRowSchema>;
  NewsletterPayload: z.infer<typeof NewsletterPayloadSchema>;
  CreateParams: z.infer<typeof NewsletterCreateParamsSchema>;
};
