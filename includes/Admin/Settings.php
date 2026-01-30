<?php
/**
 * Settings - WordPress Settings API Registration
 *
 * This file registers plugin settings with the WordPress Settings API,
 * making them accessible via the REST API for the frontend application.
 *
 * @package WpHubspotEdmEditor\Admin
 */

declare(strict_types=1);

namespace WpHubspotEdmEditor\Admin;

/**
 * Class Settings
 *
 * Registers the plugin's settings with WordPress, enabling:
 * - Storage in the wp_options table
 * - REST API access via /wp/v2/settings endpoint
 * - Type validation through JSON schema
 *
 * Settings Structure:
 * -------------------
 * The plugin stores all settings in a single option as an object:
 *
 * ```php
 * [
 *     'hubspotAccessToken' => string,  // HubSpot Private App token
 *     'hubspotTableId'     => string,  // HubDB table ID for storage
 *     'hubspotTableName'   => string,  // Human-readable table name
 *     'postTypes'          => array,   // WordPress post types to include
 * ]
 * ```
 *
 * REST API Access:
 * ----------------
 * Settings can be read/written via the WordPress REST API:
 *
 * GET /wp/v2/settings
 * POST /wp/v2/settings { "wp-hubspot-edm-editor_data": { ... } }
 *
 * Note: The frontend uses a custom endpoint for HubSpot operations,
 * but this settings registration enables standard WordPress integration.
 */
class Settings
{
    /**
     * WordPress option name for storing all plugin settings.
     *
     * This key is used in the wp_options table and as the property
     * name in the REST API settings response.
     */
    private const OPTION_NAME = 'wp-hubspot-edm-editor_data';

    /**
     * Initialize settings hooks.
     *
     * Registers the settings on both admin_init (for admin pages) and
     * rest_api_init (for REST API access). This ensures settings are
     * available in all contexts where they might be needed.
     *
     * @return void
     */
    public function init(): void
    {
        add_action('admin_init', [$this, 'registerSettings']);
        add_action('rest_api_init', [$this, 'registerSettings']);
    }

    /**
     * Register plugin settings with WordPress.
     *
     * Uses register_setting() to:
     * 1. Define the option type and defaults
     * 2. Expose the setting via REST API with schema validation
     * 3. Group the setting under our option group for settings pages
     *
     * The 'show_in_rest' schema defines the structure that the REST API
     * expects and returns, providing automatic type coercion and validation.
     *
     * @see https://developer.wordpress.org/reference/functions/register_setting/
     * @return void
     */
    public function registerSettings(): void
    {
        register_setting(
            'wp-hubspot-edm-editor',  // Option group (for settings pages)
            self::OPTION_NAME,           // Option name in database
            [
                'type' => 'object',
                'default' => [
                    'hubspotAccessToken' => '', // HubSpot API token (encrypted in production)
                    'hubspotTableId' => '',     // HubDB table ID (e.g., "12345678")
                    'hubspotTableName' => '',   // Display name for the table
                    'postTypes' => ['post'],    // Post types available for newsletter content
                ],
                // REST API schema - defines structure for GET/POST /wp/v2/settings
                'show_in_rest' => [
                    'schema' => [
                        'type' => 'object',
                        'properties' => [
                            'hubspotAccessToken' => ['type' => 'string'],
                            'hubspotTableId' => ['type' => 'string'],
                            'hubspotTableName' => ['type' => 'string'],
                            'postTypes' => [
                                'type' => 'array',
                                'items' => ['type' => 'string']
                            ],
                        ],
                    ],
                ],
            ]
        );
    }
}