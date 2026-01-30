<?php
/**
 * HubSpotService - HubSpot API Communication Layer
 *
 * This service provides a clean abstraction over the official HubSpot PHP SDK,
 * specifically targeting HubDB operations for newsletter data storage.
 *
 * @package WpHubspotEdmEditor\Newsletter\Service
 */

declare(strict_types=1);

namespace WpHubspotEdmEditor\Newsletter\Service;

use HubSpot\Factory;
use HubSpot\Client\Cms\Hubdb\ApiException;
use HubSpot\Client\Cms\Hubdb\Model\HubDbTableV3Request;
use HubSpot\Client\Cms\Hubdb\Model\ColumnRequest;
use HubSpot\Client\Cms\Hubdb\Model\HubDbTableRowV3Request;
use HubSpot\Client\Cms\Hubdb\Model\BatchInputHubDbTableRowV3Request;
use HubSpot\Client\Cms\Hubdb\Model\BatchInputString;
use HubSpot\Client\Cms\Hubdb\Model\Option;

/**
 * Class HubSpotService
 *
 * Handles all communication with the HubSpot CMS HubDB API.
 *
 * HubDB Overview:
 * ---------------
 * HubDB is HubSpot's structured data store that works like a database.
 * Data is organized into tables with typed columns and rows.
 *
 * Key concepts:
 * - Tables: Define the schema (columns and their types)
 * - Rows: Store the actual data (newsletter blocks)
 * - Draft/Published: Tables have a draft version for preview and a published version for production
 *
 * Draft vs Published Workflow:
 * ----------------------------
 * 1. Changes are made to draft rows (invisible to templates)
 * 2. Call publishDraftTable() to make changes live
 * 3. Call resetDraftTable() to discard draft changes
 *
 * This allows previewing changes before making them public.
 *
 * API Response Pattern:
 * ---------------------
 * All methods return an associative array:
 * ```php
 * // Success
 * ['success' => true, 'data' => $result]
 *
 * // Failure
 * ['success' => false, 'error' => 'Error message']
 * ```
 *
 * @see https://developers.hubspot.com/docs/api/cms/hubdb HubDB API Reference
 * @see https://github.com/HubSpot/hubspot-api-php HubSpot PHP SDK
 */
class HubSpotService
{
    /**
     * HubSpot Private App Access Token
     *
     * This token authenticates all API requests. It should have the
     * following scopes enabled:
     * - hubdb (read/write access to HubDB tables)
     *
     * @var string
     */
    private string $accessToken;

    /**
     * HubSpotService constructor.
     *
     * @param string $accessToken HubSpot Private App access token
     */
    public function __construct(string $accessToken)
    {
        $this->accessToken = $accessToken;
    }

    /**
     * Validate a HubSpot API key by testing connectivity.
     *
     * Attempts to list all HubDB tables using the provided key.
     * If successful, the key is valid and has HubDB permissions.
     *
     * @param string $apiKey The API key to validate
     * @return bool True if the key is valid, false otherwise
     */
    public function validateApiKey(string $apiKey): bool
    {
        try {
            // Create a temporary client with the provided key
            $tempClient = Factory::createWithAccessToken($apiKey);

            // Try to list tables - this will fail if the key is invalid
            $response = $tempClient->cms()->hubdb()->tablesApi()->getAllTables();

            return true;
        } catch (ApiException $e) {
            // API key is invalid or lacks permissions
            return false;
        }
    }

    /**
     * Fetch all draft rows from a HubDB table.
     *
     * Retrieves the draft (unpublished) version of all rows in the table.
     * Draft rows may contain changes that haven't been published yet.
     *
     * Response data structure:
     * ```php
     * [
     *     ['id' => '123', 'values' => ['block_id' => 'root', 'block_type' => 'EmailLayout']],
     *     ['id' => '124', 'values' => ['block_id' => 'abc', 'block_type' => 'Text']]
     * ]
     * ```
     *
     * @param string $tableId The HubDB table ID or name
     * @return array<string, mixed> Result array with 'success' and 'data'/'error'
     */
    public function getDraftTableRows(string $tableId): array
    {
        try {
            $client = Factory::createWithAccessToken($this->accessToken);
            $response = $client->cms()->hubdb()->rowsApi()->readDraftTableRows($tableId);
            $results = $response->getResults();

            // Transform SDK objects to simple arrays for easier handling
            $arrayResults = array_map(function ($row) {
                return [
                    'id' => $row->getId(),
                    'values' => $row->getValues()
                ];
            }, $results);

            return ['success' => true, 'data' => $arrayResults];
        } catch (ApiException $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }

    /**
     * Create multiple draft rows in a HubDB table.
     *
     * Uses the batch API for efficient creation of multiple rows in
     * a single API call. This is faster than creating rows individually.
     *
     * Input format (each array becomes a row):
     * ```php
     * [
     *     ['block_id' => 'root', 'block_type' => 'EmailLayout', 'block_data' => '{"..."}'],
     *     ['block_id' => 'abc', 'block_type' => 'Text', 'block_data' => '{"..."}']
     * ]
     * ```
     *
     * @param string                $tableId  The HubDB table ID
     * @param array<int, array>     $rowsData Array of row values (keyed by column name)
     * @return array<string, mixed> Result array with created row IDs
     */
    public function batchCreateDraftTableRows(string $tableId, array $rowsData): array
    {
        try {
            // Transform simple arrays into SDK request objects
            $batchInputs = array_map(function ($rowData) {
                return new HubDbTableRowV3Request(['values' => $rowData]);
            }, $rowsData);

            $batchRequest = new BatchInputHubDbTableRowV3Request(['inputs' => $batchInputs]);
            $client = Factory::createWithAccessToken($this->accessToken);
            $response = $client->cms()->hubdb()->rowsBatchApi()->createDraftTableRows($tableId, $batchRequest);

            // Extract the relevant data from SDK response objects
            $processedResults = array_map(function ($result) {
                return [
                    'id' => $result->getId(),
                    'values' => $result->getValues()
                ];
            }, $response->getResults());

            return ['success' => true, 'data' => $processedResults];
        } catch (ApiException $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }

    /**
     * Delete multiple draft rows from a HubDB table.
     *
     * Permanently removes rows by their IDs. This operation cannot be undone.
     * Uses the purge endpoint which completely removes rows (as opposed to
     * soft delete which would just archive them).
     *
     * @param string          $tableId The HubDB table ID
     * @param array<int, string> $rowIds  Array of row IDs to delete
     * @return array<string, mixed> Result array with success status
     */
    public function batchDeleteDraftTableRows(string $tableId, array $rowIds): array
    {
        try {
            // Early return if no rows to delete
            if (empty($rowIds)) {
                return ['success' => true, 'data' => 'No rows to delete'];
            }

            $batchInputString = new BatchInputString(['inputs' => $rowIds]);
            $client = Factory::createWithAccessToken($this->accessToken);
            $response = $client->cms()->hubdb()->rowsBatchApi()->purgeDraftTableRows($tableId, $batchInputString);

            return ['success' => true, 'data' => $response];
        } catch (ApiException $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }

    /**
     * Publish draft changes to make them live.
     *
     * This is a critical operation in the HubDB workflow. After making
     * changes to draft rows, calling this method pushes those changes
     * to the published version that HubL templates read from.
     *
     * Workflow:
     * 1. Make changes to draft rows (create, update, delete)
     * 2. Preview changes using draft endpoints
     * 3. Call publishDraftTable() when ready to go live
     *
     * @param string $tableId The HubDB table ID
     * @return array<string, mixed> Result array with success status
     */
    public function publishDraftTable(string $tableId): array
    {
        try {
            $client = Factory::createWithAccessToken($this->accessToken);
            $response = $client->cms()->hubdb()->tablesApi()->publishDraftTable($tableId);

            return ['success' => true, 'data' => $response];
        } catch (ApiException $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }

    /**
     * Reset draft table to match the published version.
     *
     * Discards all unpublished changes in the draft version, reverting
     * it to match the currently published state. Useful for canceling
     * changes or recovering from errors.
     *
     * @param string $tableId The HubDB table ID
     * @return array<string, mixed> Result array with success status
     */
    public function resetDraftTable(string $tableId): array
    {
        try {
            $client = Factory::createWithAccessToken($this->accessToken);
            $response = $client->cms()->hubdb()->tablesApi()->resetDraftTable($tableId);

            return ['success' => true, 'data' => $response];
        } catch (ApiException $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }

    /**
     * Create a new HubDB table with specified columns.
     *
     * Creates the table structure that will store newsletter blocks.
     * Each column is defined with a name, label, and type.
     *
     * Supported column types:
     * - TEXT: Single-line text
     * - RICHTEXT: Multi-line text with formatting
     * - NUMBER: Numeric values
     * - SELECT: Dropdown with predefined options
     * - BOOLEAN: True/false values
     * - DATE: Date values
     * - DATETIME: Date and time values
     *
     * Column definition format:
     * ```php
     * [
     *     'name' => 'block_type',
     *     'label' => 'Block Type',
     *     'type' => 'SELECT',
     *     'options' => [
     *         ['name' => 'text', 'label' => 'Text Block'],
     *         ['name' => 'image', 'label' => 'Image Block']
     *     ]
     * ]
     * ```
     *
     * Conflict Handling:
     * If a table with the same name already exists (HTTP 409), this method
     * automatically appends a unique suffix and retries the creation.
     *
     * @param string $name    Internal table name (no spaces, lowercase)
     * @param string $label   Human-readable table label
     * @param array  $columns Column definitions
     * @return array<string, mixed> Result with the created table object
     */
    public function createTable(string $name, string $label, array $columns): array
    {
        try {
            // Transform column config arrays into SDK ColumnRequest objects
            $columnRequests = array_map(function ($column) {
                $columnRequest = new ColumnRequest();
                $columnRequest->setName($column['name']);
                $columnRequest->setLabel($column['label']);
                $columnRequest->setType($column['type']);

                // Handle SELECT type columns with predefined options
                if ($column['type'] === 'SELECT' && isset($column['options'])) {
                    $options = array_map(function ($option) {
                        $optionModel = new Option();
                        $optionModel->setName($option['name']);
                        $optionModel->setLabel($option['label']);
                        return $optionModel;
                    }, $column['options']);
                    $columnRequest->setOptions($options);
                }

                return $columnRequest;
            }, $columns);

            // Build the table request
            $tableRequest = new HubDbTableV3Request();
            $tableRequest->setName($name);
            $tableRequest->setLabel($label);
            $tableRequest->setColumns($columnRequests);
            $tableRequest->setUseForPages(false); // Not used for CMS pages

            $client = Factory::createWithAccessToken($this->accessToken);
            $response = $client->cms()->hubdb()->tablesApi()->createTable($tableRequest);

            return ['success' => true, 'data' => $response];
        } catch (ApiException $e) {
            // Handle name conflict by appending unique suffix
            if ($e->getCode() === 409) {
                return $this->createTable($name . '_' . uniqid(), $label, $columns);
            }
            return ['success' => false, 'error' => $e->getMessage()];
        } catch (\Exception $e) {
            return ['success' => false, 'error' => 'Unexpected error occurred while creating table'];
        }
    }

    /**
     * Retrieve all HubDB tables in the HubSpot account.
     *
     * Returns a list of all tables the API key has access to.
     * Useful for letting users select an existing table or
     * verifying that a table exists.
     *
     * @return array<string, mixed> Result with array of table objects
     */
    public function getAllTables(): array
    {
        try {
            $client = Factory::createWithAccessToken($this->accessToken);
            $response = $client->cms()->hubdb()->tablesApi()->getAllTables();

            return ['success' => true, 'data' => $response->getResults()];
        } catch (ApiException $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
}
