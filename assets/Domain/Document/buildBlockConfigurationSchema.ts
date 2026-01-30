/**
 * buildBlockConfigurationSchema.ts - Dynamic Schema Builder
 *
 * Generates a Zod schema that can validate any block configuration
 * based on the registered block types. Uses Zod's discriminated union
 * feature for efficient type narrowing.
 *
 * How It Works:
 * -------------
 * Given a dictionary like:
 * ```ts
 * {
 *   Text: { schema: z.object({ text: z.string() }), ... },
 *   Image: { schema: z.object({ src: z.string() }), ... }
 * }
 * ```
 *
 * Generates a schema equivalent to:
 * ```ts
 * z.discriminatedUnion('type', [
 *   z.object({ type: z.literal('Text'), data: TextSchema }),
 *   z.object({ type: z.literal('Image'), data: ImageSchema })
 * ])
 * ```
 *
 * This provides:
 * - Automatic type narrowing based on 'type' field
 * - Efficient validation (only validates matching schema)
 * - Clear error messages indicating which block type failed
 *
 * @module Domain/Document
 */
import { z } from 'zod';

import { BaseZodDictionary, BlockConfiguration, DocumentBlocksDictionary } from '@/Domain/Document/utils';

/**
 * Builds a Zod schema for validating block configurations.
 *
 * The generated schema uses discriminated unions on the 'type' field
 * to determine which block schema to apply.
 *
 * Usage:
 * ```ts
 * const BlockSchema = buildBlockConfigurationSchema(dictionary);
 *
 * // Validates and narrows type
 * const result = BlockSchema.parse({ type: 'Text', data: { text: 'Hello' } });
 * // result is typed as BlockConfiguration<typeof dictionary>
 * ```
 *
 * @param blocks Dictionary of block configurations
 * @returns Zod schema that validates any block in the dictionary
 */
export function buildBlockConfigurationSchema<T extends BaseZodDictionary>(blocks: DocumentBlocksDictionary<T>) {
  // Create a schema for each block type: { type: literal, data: blockSchema }
  const blockObjects = Object.keys(blocks).map((type: keyof T) =>
    z.object({
      type: z.literal(type),
      data: blocks[type].schema,
    })
  );

  // Combine into a discriminated union and transform to proper type
  return z.discriminatedUnion('type', blockObjects as any).transform((v) => v as BlockConfiguration<T>);
}
