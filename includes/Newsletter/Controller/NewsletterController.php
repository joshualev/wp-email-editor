<?php
/**
 * NewsletterController - REST API Request Handler
 *
 * This file contains the controller that handles all REST API requests
 * for newsletter operations. It coordinates between the API layer and
 * the HubSpot service, transforming requests and responses as needed.
 *
 * @package WpHubspotEdmEditor\Newsletter\Controller
 */

declare(strict_types=1);

namespace WpHubspotEdmEditor\Newsletter\Controller;

use RuntimeException;
use WpHubspotEdmEditor\Newsletter\Model\NewsletterBlock;
use WpHubspotEdmEditor\Newsletter\Service\HubSpotService;
use WpHubspotEdmEditor\Newsletter\Config\Options;

/**
 * Class NewsletterController
 *
 * Handles REST API requests for newsletter CRUD operations.
 *
 * This controller is the bridge between the WordPress REST API and the
 * HubSpot HubDB storage. It receives requests from the frontend React
 * application and translates them into HubSpot API calls.
 *
 * Request Flow:
 * -------------
 * 1. Frontend sends REST request (e.g., POST /newsletter/update)
 * 2. Router resolves this controller from the DI container
 * 3. Controller method processes the request
 * 4. HubSpotService communicates with HubSpot API
 * 5. Response is returned to the frontend
 *
 * Available Endpoints:
 * --------------------
 * - validateApiKey: Validate and store a HubSpot API key
 * - createTable: Create a new HubDB table for newsletter storage
 * - getNewsletterData: Fetch current newsletter blocks
 * - updateNewsletter: Save newsletter blocks to HubDB
 *
 * @see Router For endpoint registration
 * @see HubSpotService For HubSpot API communication
 */
final class NewsletterController
{
    /**
     * NewsletterController constructor.
     *
     * @param HubSpotService $hubSpotService Service for HubSpot API operations
     * @param Options        $options        Plugin configuration manager
     */
    public function __construct(
        private readonly HubSpotService $hubSpotService,
        private readonly Options $options
    ) {}

    /**
     * Validate a HubSpot API key and store it if valid.
     *
     * This endpoint is used during initial plugin setup to verify that
     * the provided API key has the necessary permissions to access HubDB.
     *
     * Request:
     * ```json
     * { "apiKey": "pat-na1-xxxxxxxx" }
     * ```
     *
     * Response (success):
     * ```json
     * { "data": "pat-na1-xxxxxxxx" }
     * ```
     *
     * Response (error):
     * ```json
     * { "error": "Invalid API key", "tableId": "N/A" }
     * ```
     *
     * @param array<string, mixed> $params Request parameters including 'apiKey'
     * @return array<string, mixed> Response with data or error
     */
    public function validateApiKey(array $params): array
    {
        try {
            $apiKey = $params['apiKey'] ?? '';

            // Validate input
            if (empty($apiKey) || !is_string($apiKey)) {
                throw new RuntimeException('API key is required');
            }

            // Test the API key by making a request to HubSpot
            if (!$this->hubSpotService->validateApiKey($apiKey)) {
                throw new RuntimeException('Invalid API key');
            }

            // Store the validated key in WordPress options
            $this->options->setHubspotAccessToken($apiKey);

            return ['data' => $this->options->getHubspotAccessToken()];
        } catch (RuntimeException $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Create a new HubDB table for storing newsletter blocks.
     *
     * Creates a table with the predefined column structure needed for
     * storing newsletter block data. The table ID is automatically
     * saved to plugin options for future use.
     *
     * Request:
     * ```json
     * { "name": "newsletter_2024", "label": "Newsletter 2024" }
     * ```
     *
     * @param array<string, mixed> $params Request parameters including 'name' and 'label'
     * @return array<string, mixed> Response with created table data or error
     */
    public function createTable(array $params): array
    {
        try {
            $name = $params['name'] ?? '';
            $label = $params['label'] ?? '';

            // Validate required fields
            if (empty($name) || !is_string($name)) {
                throw new RuntimeException('Table name is required');
            }
            if (empty($label) || !is_string($label)) {
                throw new RuntimeException('Table label is required');
            }

            // Create the table with predefined columns for block storage
            $result = $this->hubSpotService->createTable(
                name: $name,
                label: $label,
                columns: Options::getHubDBTableColumns()
            );

            if (!$result['success']) {
                $this->throwHubDBError('Table creation failed');
            }

            // Store the new table ID for future operations
            $this->options->setHubspotTableId($result['data']->getId());

            return ['data' => $result['data']];
        } catch (RuntimeException $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Retrieve current newsletter data from HubDB.
     *
     * Fetches all rows from the configured HubDB table and transforms
     * them into the block structure expected by the frontend editor.
     *
     * Response structure:
     * ```json
     * {
     *   "block-uuid-1": { "type": "EmailLayout", "data": { ... } },
     *   "block-uuid-2": { "type": "ColumnsContainer", "data": { ... } }
     * }
     * ```
     *
     * @return array<string, mixed> Newsletter blocks keyed by block ID
     */
    public function getNewsletterData(): array
    {
        try {
            // Fetch draft rows from HubDB (draft allows preview before publish)
            $result = $this->hubSpotService->getDraftTableRows($this->options->getHubspotTableId());

            if (!$result['success']) {
                $this->throwHubDBError('Fetching newsletter data failed');
            }

            // Transform HubDB response to frontend block structure
            $blocks = NewsletterBlock::fromHubDBResponse($result['data']);

            // Decode JSON strings in block data
            foreach ($blocks as $key => $block) {
                if (isset($block['data']) && is_string($block['data'])) {
                    $blocks[$key]['data'] = json_decode($block['data'], true);
                }
            }

            return $blocks;
        } catch (RuntimeException $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Update newsletter blocks in HubDB.
     *
     * This performs a full replacement of all newsletter blocks:
     * 1. Delete all existing rows from the table
     * 2. Create new rows from the provided block data
     * 3. Publish the changes to make them live
     *
     * The "replace all" strategy ensures consistency and simplifies
     * synchronization logic compared to individual row updates.
     *
     * Request body should contain blocks in the hubdbRows format:
     * ```json
     * {
     *   "blocks": {
     *     "hubdbRows": [
     *       { "blockId": "root", "blockType": "EmailLayout", "blockData": "{...}" }
     *     ]
     *   }
     * }
     * ```
     *
     * @param array<string, mixed> $params Request parameters containing 'blocks'
     * @return array<string, mixed> Empty array on success, error on failure
     */
    public function updateNewsletter(array $params): array
    {
        try {
            // Extract blocks from request (handle both nested and flat structure)
            $blocks = $params['blocks'] ?? $params;

            if (!is_array($blocks)) {
                throw new RuntimeException('Blocks data is required');
            }

            $tableId = $this->options->getHubspotTableId();

            /*
            |------------------------------------------------------------------
            | Replace Strategy: Delete → Create → Publish
            |------------------------------------------------------------------
            |
            | We use a full replacement strategy for several reasons:
            | 1. Simpler than tracking individual block changes
            | 2. Ensures consistency between frontend and HubDB
            | 3. Avoids orphaned rows from deleted blocks
            | 4. Newsletter data is small enough that this is efficient
            |
            */

            $this->deleteExistingRows($tableId);
            $this->createNewRows($tableId, $blocks);
            $this->publishChanges($tableId);

            return [];
        } catch (RuntimeException $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Delete all existing rows from the HubDB table.
     *
     * Fetches current rows and batch deletes them. This prepares the
     * table for receiving the updated block data.
     *
     * @param string $tableId The HubDB table ID
     * @throws RuntimeException If the delete operation fails
     * @return void
     */
    private function deleteExistingRows(string $tableId): void
    {
        // First, get all existing row IDs
        $existingRows = $this->hubSpotService->getDraftTableRows($tableId);

        if (!$existingRows['success']) {
            $this->throwHubDBError('Fetching existing rows failed');
        }

        // Extract row IDs for batch deletion
        $rowIds = array_column($existingRows['data'], 'id');

        // Only delete if there are existing rows
        if (!empty($rowIds)) {
            $deleteResult = $this->hubSpotService->batchDeleteDraftTableRows($tableId, $rowIds);
            if (!$deleteResult['success']) {
                $this->throwHubDBError('Deleting existing rows failed');
            }
        }
    }

    /**
     * Create new rows in the HubDB table from block data.
     *
     * Transforms the frontend block structure to HubDB row format
     * and batch creates all rows in a single API call.
     *
     * @param string                      $tableId The HubDB table ID
     * @param array<int, NewsletterBlock> $blocks  Block data from frontend
     * @throws RuntimeException If the create operation fails
     * @return void
     */
    private function createNewRows(string $tableId, array $blocks): void
    {
        // Transform blocks to HubDB row format
        $hubDBRows = NewsletterBlock::toHubDBResponse($blocks);

        // Batch create all rows
        $createResult = $this->hubSpotService->batchCreateDraftTableRows($tableId, $hubDBRows);

        if (!$createResult['success']) {
            $this->throwHubDBError('Creating new rows failed');
        }
    }

    /**
     * Publish draft changes to make them live.
     *
     * HubDB uses a draft/published workflow. Changes made to draft
     * rows are not visible until the table is published.
     *
     * @param string $tableId The HubDB table ID
     * @throws RuntimeException If the publish operation fails
     * @return void
     */
    private function publishChanges(string $tableId): void
    {
        $publishResult = $this->hubSpotService->publishDraftTable($tableId);

        if (!$publishResult['success']) {
            $this->throwHubDBError('Publishing changes failed');
        }
    }

    /**
     * Throw a HubDB-related error.
     *
     * @param string $message Error message
     * @throws RuntimeException Always throws
     * @return never
     */
    private function throwHubDBError(string $message): void
    {
        throw new RuntimeException($message);
    }

    /**
     * Handle exceptions by returning a standardized error response.
     *
     * @param RuntimeException $exception The caught exception
     * @return array<string, mixed> Error response with message and table ID
     */
    private function handleException(RuntimeException $exception): array
    {
        return [
            'error' => $exception->getMessage(),
            'tableId' => $this->options->getHubspotTableId() ?? 'N/A',
        ];
    }
}
