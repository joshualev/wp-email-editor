<?php
/**
 * Options - Plugin Configuration Manager
 *
 * This file provides a type-safe interface for accessing and modifying
 * plugin settings stored in the WordPress options table. It wraps the
 * raw WordPress get_option/update_option calls with validation and
 * domain-specific methods.
 *
 * @package WpHubspotEdmEditor\Newsletter\Config
 */

declare(strict_types=1);

namespace WpHubspotEdmEditor\Newsletter\Config;

use WP_Error;

/**
 * Class Options
 *
 * Manages plugin configuration stored in WordPress wp_options table.
 *
 * This class provides:
 * - Type-safe getters and setters for specific configuration values
 * - Validation with helpful error messages when required values are missing
 * - HubDB table column configuration for creating new tables
 *
 * All settings are stored in a single serialized option for efficiency.
 * The option name matches what's registered in the Settings class.
 *
 * Usage:
 * ------
 * ```php
 * $options = new Options();
 *
 * // Get values
 * $token = $options->getHubspotAccessToken();
 * $tableId = $options->getHubspotTableId();
 *
 * // Set values
 * $options->setHubspotAccessToken('pat-na1-xxxxx');
 * $options->setHubspotTableId('12345678');
 * ```
 *
 * @see \WpHubspotEdmEditor\Admin\Settings For REST API registration
 */
class Options
{
    /**
     * WordPress option name where all plugin settings are stored.
     *
     * This is a serialized array containing all configuration values.
     * The same key is used in the Settings class for REST API exposure.
     */
    private const OPTION_NAME = 'wp-hubspot-edm-editor_data';

    /**
     * Get a single configuration value by key.
     *
     * @param string $key The configuration key to retrieve
     * @return mixed The value if set, null otherwise
     */
    public function get(string $key): mixed
    {
        $options = $this->getOptions();
        return $options[$key] ?? null;
    }

    /**
     * Set a single configuration value.
     *
     * Updates just the specified key while preserving other values.
     *
     * @param string $key   The configuration key to set
     * @param mixed  $value The value to store
     * @return void
     */
    public function set(string $key, mixed $value): void
    {
        $options = $this->getOptions();
        $options[$key] = $value;
        $this->saveOptions($options);
    }

    /**
     * Get the HubSpot access token.
     *
     * The access token is required for all HubSpot API operations.
     * It should be a Private App token with HubDB read/write scopes.
     *
     * @throws WP_Error When the token is not configured
     * @return string The HubSpot access token
     */
    public function getHubspotAccessToken(): string
    {
        $token = $this->get('hubspotAccessToken');
        if (empty($token)) {
            throw new WP_Error(
                'missing_hubspot_token',
                __('HubSpot access token is required. Please configure it in the plugin settings.', 'wp-hubspot-edm-editor'),
                ['status' => 400]
            );
        }
        return $token;
    }

    /**
     * Set the HubSpot access token.
     *
     * @param string $token The HubSpot Private App access token
     * @return void
     */
    public function setHubspotAccessToken(string $token): void
    {
        $this->set('hubspotAccessToken', $token);
    }

    /**
     * Get the HubDB table ID used for newsletter storage.
     *
     * The table ID is assigned by HubSpot when a table is created.
     * It's used in all subsequent API calls to read/write rows.
     *
     * @throws WP_Error When the table ID is not configured
     * @return string The HubDB table ID (numeric string)
     */
    public function getHubspotTableId(): string
    {
        $tableId = $this->get('hubspotTableId');
        if (empty($tableId)) {
            throw new WP_Error(
                'missing_hubspot_table_id',
                __('HubSpot table ID is required. Please configure it in the plugin settings.', 'wp-hubspot-edm-editor'),
                ['status' => 400]
            );
        }
        return $tableId;
    }

    /**
     * Set the HubDB table ID.
     *
     * @param string $tableId The HubDB table ID from HubSpot
     * @return void
     */
    public function setHubspotTableId(string $tableId): void
    {
        $this->set('hubspotTableId', $tableId);
    }

    /**
     * Get the HubDB table column configuration.
     *
     * Returns the column definitions used when creating a new HubDB table.
     * These columns store the newsletter block data:
     *
     * - block_id: Unique identifier for each block (e.g., "root", UUID)
     * - block_type: The type of block (e.g., "EmailLayout", "ColumnsContainer")
     * - block_data: JSON string containing all block properties
     *
     * The data structure allows the HubL template to iterate through blocks
     * and render them appropriately based on their type and configuration.
     *
     * @return array<int, array{name: string, label: string, type: string}>
     */
    public static function getHubDBTableColumns(): array
    {
        return [
            [
                'name' => 'block_id',
                'label' => 'Block ID',
                'type' => 'TEXT'
            ],
            [
                'name' => 'block_type',
                'label' => 'Block Type',
                'type' => 'TEXT'
            ],
            [
                'name' => 'block_data',
                'label' => 'Block Data',
                'type' => 'TEXT'
            ]
        ];
    }

    /**
     * Retrieve all options from WordPress.
     *
     * @return array<string, mixed> All plugin options
     */
    private function getOptions(): array
    {
        return get_option(self::OPTION_NAME, []);
    }

    /**
     * Save all options to WordPress.
     *
     * @param array<string, mixed> $options The complete options array to save
     * @return void
     */
    private function saveOptions(array $options): void
    {
        update_option(self::OPTION_NAME, $options);
    }
}
