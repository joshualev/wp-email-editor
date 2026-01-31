/**
 * Domain/types.ts - Core Domain Type Definitions
 *
 * This file contains the fundamental type definitions for the newsletter
 * editor domain. These types represent the core business entities.
 *
 * Domain-Driven Design:
 * ---------------------
 * The Domain layer contains business logic independent of:
 * - UI framework (React)
 * - State management (Zustand)
 * - External APIs (HubSpot, WordPress)
 *
 * Type Categories:
 * ----------------
 * 1. Editor Types - Block and configuration types from Zod schemas
 * 2. WordPress Types - Post data from the WordPress REST API
 * 3. Type Guards - Runtime type checking functions
 *
 * @module Domain
 */
import { z } from 'zod';
import {
  EditorBlockSchema,
  EditorConfigurationSchema
} from '@/Application/components/Editor/editor-core';

/*
|--------------------------------------------------------------------------
| Core Editor Types
|--------------------------------------------------------------------------
|
| These types are inferred from Zod schemas, ensuring runtime validation
| matches TypeScript's compile-time types.
|
*/

/** A single editor block (any block type) */
export type TEditorBlock = z.infer<typeof EditorBlockSchema>;

/** The complete editor document configuration */
export type TEditorConfiguration = z.infer<typeof EditorConfigurationSchema>;

/*
|--------------------------------------------------------------------------
| WordPress Post Types
|--------------------------------------------------------------------------
|
| Types for WordPress post data fetched via the REST API.
| Used by BlogPost blocks to display dynamic content.
|
*/

/**
 * WordPress post type identifier.
 *
 * We intentionally allow any non-empty string here because available post types
 * are discovered at runtime from the WordPress REST API. Validation of allowed
 * types should happen in the API/refiner layer, not the Domain schema.
 */
export const WordPressPostTypeSchema = z.string().min(1);

/** WordPress post data schema */
export const WordPressPostSchema = z.object({
  wordpressId: z.string(),
  postType: WordPressPostTypeSchema,
  permalink: z.string(),
  image: z.string().optional(),
  title: z.string().optional(),
  excerpt: z.string().optional(),
  date: z.string().optional(),
  sponsor_name: z.string().optional(),
  event_start_date: z.string().optional(),
  event_end_date: z.string().optional()
});

export type TWordPressPostType = z.infer<typeof WordPressPostTypeSchema>;
export type TWordPressPost = z.infer<typeof WordPressPostSchema>;

/*
|--------------------------------------------------------------------------
| Type Guards
|--------------------------------------------------------------------------
|
| Runtime type checking functions for narrowing block types.
| Use these when you need to access block-specific properties.
|
| Example:
| ```ts
| if (isEmailLayout(block)) {
|   // TypeScript knows block.data has childrenIds
|   console.log(block.data.childrenIds);
| }
| ```
|
*/

/**
 * Type guard for EmailLayout blocks.
 * EmailLayout is the root block containing all rows.
 */
export const isEmailLayout = (
  block: TEditorBlock
): block is Extract<TEditorBlock, { type: 'EmailLayout' }> =>
  block.type === 'EmailLayout';

/**
 * Type guard for ColumnsContainer blocks.
 * ColumnsContainer represents a row with one or more columns.
 */
export const isColumnsContainer = (
  block: TEditorBlock
): block is Extract<TEditorBlock, { type: 'ColumnsContainer' }> =>
  block.type === 'ColumnsContainer';
