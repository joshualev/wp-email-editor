/**
 * buildBlockConfigurationDictionary.ts - Block Registry Type Helper
 *
 * A type-safe identity function that validates and returns the block
 * configuration dictionary. While it doesn't transform the data,
 * it enforces the correct structure at compile time.
 *
 * Why Use This?
 * -------------
 * TypeScript's structural typing can sometimes be too lenient.
 * This function ensures:
 * - Each block has both a schema and Component
 * - Component props match the schema's inferred type
 * - No extra or missing properties
 *
 * @module Domain/Document
 */
import { BaseZodDictionary, DocumentBlocksDictionary } from '@/Domain/Document/utils';

/**
 * Creates a type-safe block configuration dictionary.
 *
 * Usage:
 * ```ts
 * const dictionary = buildBlockConfigurationDictionary({
 *   Text: {
 *     schema: TextSchema,
 *     Component: TextBlock
 *   },
 *   Image: {
 *     schema: ImageSchema,
 *     Component: ImageBlock
 *   }
 * });
 * ```
 *
 * @param blocks Dictionary of block configurations
 * @returns The same dictionary with explicit typing
 */
export function buildBlockConfigurationDictionary<T extends BaseZodDictionary>(
  blocks: DocumentBlocksDictionary<T>
) {
  return blocks;
}
