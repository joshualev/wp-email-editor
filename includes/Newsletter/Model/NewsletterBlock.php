<?php
/**
 * NewsletterBlock - Data Transformation Model
 *
 * This file contains the model responsible for transforming data between
 * the frontend block structure and the HubDB row format.
 *
 * @package WpHubspotEdmEditor\Newsletter\Model
 */

declare(strict_types=1);

namespace WpHubspotEdmEditor\Newsletter\Model;

use RuntimeException;

/**
 * Class NewsletterBlock
 *
 * Transforms newsletter block data between frontend and HubDB formats.
 *
 * This is a value object/DTO pattern implementation that handles the
 * bidirectional transformation of block data. The class is readonly
 * to enforce immutability.
 *
 * Data Flow:
 * ----------
 *
 * Frontend → HubDB (Save):
 * ```
 * {                                     →  [
 *   "root": {                           →    ["block_id" => "root",
 *     "type": "EmailLayout",            →     "block_type" => "EmailLayout",
 *     "data": { "width": 600 }          →     "block_data" => '{"width":600}']
 *   }                                   →  ]
 * }
 * ```
 *
 * HubDB → Frontend (Load):
 * ```
 * [                                     →  {
 *   { "id": "123",                       →    "root": {
 *     "values": {                        →      "type": "EmailLayout",
 *       "block_id": ["root"],            →      "data": { "width": 600 }
 *       "block_type": ["EmailLayout"],   →    }
 *       "block_data": ['{"width":600}']  →  }
 *     }                                  →
 *   }                                    →
 * ]                                      →
 * ```
 *
 * Why Transform?
 * --------------
 * The frontend uses a nested object structure keyed by block ID for
 * fast lookups and easy manipulation in JavaScript. HubDB stores data
 * as flat rows with typed columns. This model bridges that gap.
 *
 * @see NewsletterController::getNewsletterData() Uses fromHubDBResponse
 * @see NewsletterController::updateNewsletter() Uses toHubDBResponse
 */
final readonly class NewsletterBlock
{
    /**
     * NewsletterBlock constructor.
     *
     * Private to enforce use of static factory methods.
     *
     * @param string|null $id        HubDB row ID (null for new blocks)
     * @param string      $blockId   Unique block identifier (e.g., "root", "abc-123")
     * @param string      $blockType Block type name (e.g., "EmailLayout", "Text")
     * @param string      $blockData JSON-encoded block configuration data
     */
    private function __construct(
        public ?string $id,
        public string $blockId,
        public string $blockType,
        public string $blockData
    ) {}

    /**
     * Transform HubDB row response into frontend block structure.
     *
     * Converts the flat row array from HubDB into a keyed object
     * structure that the frontend React application expects.
     *
     * HubDB response format (input):
     * ```php
     * [
     *     [
     *         'id' => '123456789',
     *         'values' => [
     *             'block_id' => ['root'],          // HubDB returns arrays
     *             'block_type' => ['EmailLayout'],
     *             'block_data' => ['{"width":600}']
     *         ]
     *     ],
     *     // ... more rows
     * ]
     * ```
     *
     * Frontend format (output):
     * ```php
     * [
     *     'root' => [
     *         'type' => 'EmailLayout',
     *         'data' => '{"width":600}'  // Note: JSON string, decoded later
     *     ],
     *     // ... more blocks
     * ]
     * ```
     *
     * @param array<int, array{id: string, values: array}> $hubdbResponse Raw HubDB rows
     * @return array<string, array{type: string, data: string}> Blocks keyed by ID
     */
    public static function fromHubDBResponse(array $hubdbResponse): array
    {
        return array_reduce(
            $hubdbResponse,
            fn(array $newsletterBlocks, array $row): array => [
                ...$newsletterBlocks,
                // HubDB returns column values as arrays, take first element
                $row['values']['block_id'][0] => [
                    'type' => $row['values']['block_type'][0],
                    'data' => $row['values']['block_data'][0]
                ]
            ],
            []
        );
    }

    /**
     * Transform frontend block data into HubDB row format.
     *
     * Converts the request payload from the frontend into the flat
     * row structure that HubDB expects for batch insertion.
     *
     * Frontend request format (input):
     * ```php
     * [
     *     'hubdbRows' => [
     *         [
     *             'blockId' => 'root',
     *             'blockType' => 'EmailLayout',
     *             'blockData' => '{"width":600}'
     *         ],
     *         // ... more blocks
     *     ]
     * ]
     * ```
     *
     * HubDB row format (output):
     * ```php
     * [
     *     [
     *         'block_id' => 'root',
     *         'block_type' => 'EmailLayout',
     *         'block_data' => '{"width":600}'
     *     ],
     *     // ... more rows
     * ]
     * ```
     *
     * @param array{hubdbRows: array} $requestPayload Request data with hubdbRows
     * @return array<int, array{block_id: string, block_type: string, block_data: string}> Rows for HubDB
     * @throws RuntimeException If hubdbRows is missing or block data is invalid
     */
    public static function toHubDBResponse(array $requestPayload): array
    {
        // Validate required structure
        if (!isset($requestPayload['hubdbRows'])) {
            throw new RuntimeException('Invalid request payload: hubdbRows missing');
        }

        return array_map(
            fn(array $block): array => match (true) {
                // Validate each block has required fields
                !isset($block['blockId'], $block['blockType'], $block['blockData'])
                => throw new RuntimeException('Invalid block: required fields missing'),

                // Transform camelCase (frontend) to snake_case (HubDB)
                default => [
                    'block_id' => $block['blockId'],
                    'block_type' => $block['blockType'],
                    'block_data' => $block['blockData']
                ]
            },
            $requestPayload['hubdbRows']
        );
    }
}
