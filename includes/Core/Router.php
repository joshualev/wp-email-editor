<?php
/**
 * Router - REST API Route Registration
 *
 * This file handles the registration of all WordPress REST API endpoints
 * for the plugin. It maps URL routes to controller methods and defines
 * permission requirements for each endpoint.
 *
 * @package WpHubspotEdmEditor\Core
 */

declare(strict_types=1);

namespace WpHubspotEdmEditor\Core;

use WpHubspotEdmEditor\Newsletter\Controller\NewsletterController;
use Psr\Container\ContainerInterface;
use WP_REST_Request;

/**
 * Class Router
 *
 * Registers REST API routes under the 'wp-hubspot-edm-editor/v1' namespace.
 *
 * Routes are organized by permission level:
 * - Admin routes (manage_options): API key validation, table creation
 * - Editor routes (edit_posts): Newsletter fetch and update
 *
 * The router uses the DI container to lazily resolve controllers, which means
 * controllers are only instantiated when their routes are accessed.
 *
 * API Namespace: wp-hubspot-edm-editor/v1
 *
 * Available Endpoints:
 * --------------------
 * POST /newsletter/validate - Validate HubSpot API key (admin only)
 * POST /newsletter/create   - Create HubDB table (admin only)
 * GET  /newsletter/fetch    - Fetch newsletter blocks (editor+)
 * POST /newsletter/update   - Update newsletter blocks (editor+)
 *
 * @example
 * ```php
 * // Fetch newsletter data via REST API
 * GET /wp-json/wp-hubspot-edm-editor/v1/newsletter/fetch
 *
 * // Update newsletter (requires authentication)
 * POST /wp-json/wp-hubspot-edm-editor/v1/newsletter/update
 * Content-Type: application/json
 * X-WP-Nonce: <nonce>
 *
 * { "blocks": { ... } }
 * ```
 */
class Router
{
    /**
     * The dependency injection container.
     *
     * Used to resolve controller instances when routes are accessed.
     *
     * @var ContainerInterface
     */
    private ContainerInterface $container;

    /**
     * Router constructor.
     *
     * @param ContainerInterface $container The DI container for resolving controllers
     */
    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    /**
     * Register all REST API routes.
     *
     * Hooks into 'rest_api_init' to register routes when the REST API
     * is initialized. This ensures routes are only registered when needed.
     *
     * @return void
     */
    public function registerRoutes(): void
    {
        add_action('rest_api_init', function (): void {
            $this->registerNewsletterRoutes();
        });
    }

    /**
     * Register newsletter-specific routes.
     *
     * Organizes routes by permission level for clarity and security.
     * Admin routes require 'manage_options' capability (administrators).
     * Editor routes require 'edit_posts' capability (editors and above).
     *
     * @return void
     */
    private function registerNewsletterRoutes(): void
    {
        /*
        |----------------------------------------------------------------------
        | Admin Routes (manage_options capability required)
        |----------------------------------------------------------------------
        |
        | These routes are for plugin configuration and require administrator
        | privileges. They handle one-time setup tasks like API key validation
        | and HubDB table creation.
        |
        */

        // Validate and store HubSpot API key
        $this->registerRoute(
            'newsletter/validate',
            [NewsletterController::class, 'validateApiKey'],
            'POST',
            'checkAdminPermission'
        );

        // Create a new HubDB table for storing newsletter blocks
        $this->registerRoute(
            'newsletter/create',
            [NewsletterController::class, 'createTable'],
            'POST',
            'checkAdminPermission'
        );

        /*
        |----------------------------------------------------------------------
        | Editor Routes (edit_posts capability required)
        |----------------------------------------------------------------------
        |
        | These routes are for day-to-day newsletter editing and are available
        | to editors and administrators. They handle fetching and updating
        | newsletter content.
        |
        */

        // Fetch current newsletter blocks from HubDB
        $this->registerRoute(
            'newsletter/fetch',
            [NewsletterController::class, 'getNewsletterData'],
            'GET',
            'checkEditorPermission'
        );

        // Update newsletter blocks in HubDB
        $this->registerRoute(
            'newsletter/update',
            [NewsletterController::class, 'updateNewsletter'],
            'POST',
            'checkEditorPermission'
        );
    }

    /**
     * Register a single REST API route.
     *
     * Creates a WordPress REST API route with the given configuration.
     * The callback uses the DI container to resolve the controller class,
     * then calls the specified method with the request parameters.
     *
     * @param string $route              The route path (appended to namespace)
     * @param array  $callback           [ControllerClass, 'methodName'] format
     * @param string $method             HTTP method (GET, POST, etc.)
     * @param string $permissionCallback Name of the permission check method
     *
     * @return void
     */
    private function registerRoute(
        string $route,
        array $callback,
        string $method,
        string $permissionCallback
    ): void {
        register_rest_route('wp-hubspot-edm-editor/v1', $route, [
            'methods' => $method,
            'callback' => function (WP_REST_Request $request) use ($callback): array {
                // Resolve the controller from the DI container
                $controller = $this->container->get($callback[0]);
                // Call the controller method with request parameters
                return $controller->{$callback[1]}($request->get_params());
            },
            'permission_callback' => [$this, $permissionCallback],
        ]);
    }

    /**
     * Check if the current user has administrator privileges.
     *
     * Required capability: manage_options
     * This is typically only available to administrators.
     *
     * @return bool True if user can manage options, false otherwise
     */
    public function checkAdminPermission(): bool
    {
        return current_user_can('manage_options');
    }

    /**
     * Check if the current user has editor privileges.
     *
     * Required capability: edit_posts
     * This is available to editors, authors, and administrators.
     *
     * @return bool True if user can edit posts, false otherwise
     */
    public function checkEditorPermission(): bool
    {
        return current_user_can('edit_posts');
    }
}
