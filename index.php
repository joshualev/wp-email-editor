<?php
/**
 * Plugin Name: wp-hubspot-edm-editor
 * Plugin URI: https://www.example.com/
 * Description: wp-hubspot-edm-editor Plugin.
 * Version: 1.1.1
 * Author: Joshua Levinson
 * Author URI: https://www.example.com/
 * Text Domain: wp-hubspot-edm-editor
 * Domain Path: /languages
 *
 * @package WpHubspotEdmEditor
 *
 * This plugin provides a modern, drag-and-drop email newsletter editor that integrates
 * with HubSpot HubDB. It allows WordPress editors to visually design email newsletters
 * using a block-based interface, which are then synchronized to HubSpot for use in
 * email marketing campaigns.
 *
 * Architecture Overview:
 * ----------------------
 * - Frontend: React/TypeScript application built with Material UI
 * - Backend: PHP with PSR-4 autoloading and dependency injection (PHP-DI)
 * - Data Storage: HubSpot HubDB tables (external, not WordPress database)
 * - API: WordPress REST API endpoints for CRUD operations
 *
 * Key Components:
 * ---------------
 * - Bootstrap: Initializes the plugin, DI container, and registers hooks
 * - Router: Registers REST API endpoints with permission callbacks
 * - NewsletterController: Handles API requests for newsletter operations
 * - HubSpotService: Communicates with HubSpot HubDB API
 * - Options: Manages plugin settings stored in WordPress options table
 */

declare(strict_types=1);

use WpHubspotEdmEditor\Core\Bootstrap;

// If this file is called directly, abort.
if (!defined('WPINC')) {
    die;
}

/*
|--------------------------------------------------------------------------
| Plugin Constants
|--------------------------------------------------------------------------
|
| These constants are used throughout the plugin for consistent access to
| version information, file paths, and URLs. They are defined early to
| ensure availability in all plugin files.
|
*/

/** Current plugin version - update this when releasing new versions */
define('WP_HUBSPOT_EDM_EDITOR_VERSION', '1.1.1');

/** Absolute path to the plugin directory (with trailing slash) */
define('WP_HUBSPOT_EDM_EDITOR_PLUGIN_DIR', plugin_dir_path(__FILE__));

/** URL to the plugin directory (with trailing slash) */
define('WP_HUBSPOT_EDM_EDITOR_PLUGIN_URL', plugin_dir_url(__FILE__));

/** Plugin slug used for menu registration, REST API namespace, and option keys */
const WP_HUBSPOT_EDM_EDITOR_SLUG = 'wp-hubspot-edm-editor';

/*
|--------------------------------------------------------------------------
| Composer Autoloader
|--------------------------------------------------------------------------
|
| Load the Composer autoloader to enable PSR-4 autoloading for all classes
| in the 'includes' directory. This eliminates the need for manual require
| statements and allows clean namespaced class organization.
|
*/
require_once WP_HUBSPOT_EDM_EDITOR_PLUGIN_DIR . 'vendor/autoload.php';

/*
|--------------------------------------------------------------------------
| Plugin Initialization
|--------------------------------------------------------------------------
|
| Bootstrap the plugin by creating the main Bootstrap instance and calling
| init(). This sets up the dependency injection container, registers REST
| API routes, and initializes admin components.
|
*/

/**
 * Initializes the plugin.
 *
 * Creates a new Bootstrap instance and runs the initialization sequence.
 * This function is called immediately to ensure the plugin is ready when
 * WordPress loads it.
 *
 * @return void
 */
function run_wp_hubspot_edm_editor(): void
{
    $bootstrap = new Bootstrap();
    $bootstrap->init();
}

run_wp_hubspot_edm_editor();
