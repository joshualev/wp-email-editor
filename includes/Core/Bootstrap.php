<?php
/**
 * Bootstrap - Plugin Initialization
 *
 * This file is responsible for bootstrapping the entire plugin. It creates
 * the dependency injection container, registers REST API routes, and
 * initializes WordPress admin components.
 *
 * @package WpHubspotEdmEditor\Core
 */

declare(strict_types=1);

namespace WpHubspotEdmEditor\Core;

use DI\Container;
use DI\ContainerBuilder;
use WpHubspotEdmEditor\Core\Config;
use WpHubspotEdmEditor\Core\Router;
use WpHubspotEdmEditor\Admin\Settings;
use WpHubspotEdmEditor\Admin\Menu;

/**
 * Class Bootstrap
 *
 * The main entry point for plugin initialization. This class orchestrates
 * the setup of all plugin components in the correct order:
 *
 * 1. Dependency Injection Container - Manages service instantiation
 * 2. Router - Registers REST API endpoints
 * 3. Admin Components - Sets up WordPress admin menu and settings
 *
 * The DI container ensures that services are properly wired together with
 * their dependencies, making the codebase testable and maintainable.
 *
 * @example
 * ```php
 * $bootstrap = new Bootstrap();
 * $bootstrap->init();
 * ```
 */
class Bootstrap
{
    /**
     * The dependency injection container instance.
     *
     * @var Container|null
     */
    private ?Container $container = null;

    /**
     * Initialize the plugin.
     *
     * This is the main entry point called from index.php. It runs the
     * initialization sequence in the correct order to ensure all
     * dependencies are available when needed.
     *
     * @return void
     */
    public function init(): void
    {
        $this->initContainer();
        $this->initRouter();
        $this->initAdminComponents();
    }

    /**
     * Initialize the dependency injection container.
     *
     * Creates a PHP-DI container with service definitions from Config.
     * The container is used to resolve dependencies automatically when
     * instantiating services, controllers, and other components.
     *
     * @see Config::getDependencies() For the list of registered services
     * @return void
     */
    private function initContainer(): void
    {
        $containerBuilder = new ContainerBuilder();
        $containerBuilder->addDefinitions(Config::getDependencies());
        $this->container = $containerBuilder->build();
    }

    /**
     * Initialize the REST API router.
     *
     * Retrieves the Router instance from the DI container and registers
     * all REST API routes. Routes are registered on the 'rest_api_init'
     * action hook to ensure WordPress REST API is available.
     *
     * @return void
     */
    private function initRouter(): void
    {
        /** @var Router $router */
        $router = $this->container->get(Router::class);
        $router->registerRoutes();
    }

    /**
     * Initialize WordPress admin components.
     *
     * Sets up the admin menu page and registers plugin settings.
     * These components are retrieved from the DI container to ensure
     * consistent instantiation.
     *
     * Components initialized:
     * - Settings: Registers plugin options with WordPress Settings API
     * - Menu: Adds the plugin menu item to WordPress admin sidebar
     *
     * @return void
     */
    private function initAdminComponents(): void
    {
        /** @var Settings $settings */
        $settings = $this->container->get(Settings::class);
        $settings->init();

        /** @var Menu $menu */
        $menu = $this->container->get(Menu::class);
        $menu->init();
    }
}
