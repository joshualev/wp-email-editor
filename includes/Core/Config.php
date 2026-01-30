<?php
/**
 * Config - Dependency Injection Container Configuration
 *
 * This file defines all service dependencies for the PHP-DI container.
 * It acts as the "wiring" configuration that tells the container how
 * to instantiate each service and what dependencies to inject.
 *
 * @package WpHubspotEdmEditor\Core
 */

declare(strict_types=1);

namespace WpHubspotEdmEditor\Core;

use Psr\Container\ContainerInterface;
use WpHubspotEdmEditor\Newsletter\Config\Options;
use WpHubspotEdmEditor\Newsletter\Service\HubSpotService;
use WpHubspotEdmEditor\Newsletter\Controller\NewsletterController;
use WpHubspotEdmEditor\Admin\{
    Menu,
    Settings
};

/**
 * Class Config
 *
 * Provides dependency injection container configuration using PHP-DI.
 *
 * The container uses factory functions to create service instances. This allows:
 * - Lazy loading: Services are only created when first requested
 * - Dependency injection: Services can request other services from the container
 * - Centralized configuration: All service wiring is in one place
 *
 * Service Hierarchy:
 * ------------------
 * Options (configuration storage)
 *    ↓
 * HubSpotService (requires access token from Options)
 *    ↓
 * NewsletterController (requires HubSpotService and Options)
 *    ↓
 * Router (requires container to resolve controllers)
 *
 * @see https://php-di.org/ PHP-DI documentation
 */
class Config
{
    /**
     * Get all dependency definitions for the DI container.
     *
     * Returns an associative array where:
     * - Keys are class names (used as service identifiers)
     * - Values are factory functions that create the service instances
     *
     * Factory functions receive the ContainerInterface as a parameter,
     * allowing them to resolve other dependencies.
     *
     * @return array<class-string, callable> Array of service definitions
     *
     * @example
     * ```php
     * $containerBuilder = new ContainerBuilder();
     * $containerBuilder->addDefinitions(Config::getDependencies());
     * $container = $containerBuilder->build();
     *
     * // Now you can get services from the container
     * $controller = $container->get(NewsletterController::class);
     * ```
     */
    public static function getDependencies(): array
    {
        return [
            /*
            |------------------------------------------------------------------
            | Core Configuration Components
            |------------------------------------------------------------------
            |
            | Options provides access to plugin settings stored in the
            | WordPress options table. It's a dependency for services that
            | need configuration values like API tokens.
            |
            */
            Options::class => function (ContainerInterface $c): Options {
                return new Options();
            },

            /*
            |------------------------------------------------------------------
            | External Services
            |------------------------------------------------------------------
            |
            | HubSpotService handles all communication with the HubSpot API.
            | It requires the access token from Options to authenticate
            | API requests.
            |
            */
            HubSpotService::class => function (ContainerInterface $c): HubSpotService {
                /** @var Options $options */
                $options = $c->get(Options::class);
                return new HubSpotService($options->getHubspotAccessToken());
            },

            /*
            |------------------------------------------------------------------
            | Controllers
            |------------------------------------------------------------------
            |
            | Controllers handle REST API requests. They receive services
            | as dependencies and coordinate between the API layer and
            | business logic.
            |
            */
            NewsletterController::class => function (ContainerInterface $c): NewsletterController {
                return new NewsletterController(
                    $c->get(HubSpotService::class),
                    $c->get(Options::class)
                );
            },

            /*
            |------------------------------------------------------------------
            | Admin Components
            |------------------------------------------------------------------
            |
            | These components handle WordPress admin functionality.
            | They don't have dependencies, so they're created directly.
            |
            */
            Settings::class => function (): Settings {
                return new Settings();
            },

            Menu::class => function (): Menu {
                return new Menu();
            },

            /*
            |------------------------------------------------------------------
            | Infrastructure
            |------------------------------------------------------------------
            |
            | Router needs the container itself to lazily resolve controllers
            | when routes are accessed. This prevents instantiating all
            | controllers on every request.
            |
            */
            Router::class => function (ContainerInterface $c): Router {
                return new Router($c);
            },
        ];
    }
}
