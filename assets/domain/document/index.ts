export { buildBlockConfigurationSchema } from '@/domain/document/buildBlockConfigurationSchema';
export { buildBlockConfigurationDictionary } from '@/domain/document/buildBlockConfigurationDictionary';

export * from './utils';

/**
 * This module provides utilities and builders for creating and managing
 * document blocks in a flexible, type-safe manner.
 *
 * Exported functions:
 * - buildBlockConfigurationSchema: Builds a Zod schema for validating block configurations.
 * - buildBlockConfigurationDictionary: A type-safe identity function for block dictionaries.
 *
 * Exported types:
 * - BlockConfiguration: Represents the configuration for a single document block.
 * - DocumentBlocksDictionary: A dictionary of document blocks with schemas and components.
 */
