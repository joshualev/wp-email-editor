# wp-hubspot-edm-editor (Email Design Manager)

A WordPress plugin that provides a modern, drag-and-drop email newsletter editor with HubSpot HubDB integration. Build beautiful, responsive email newsletters directly from WordPress and publish them to HubSpot for email marketing campaigns.

![WordPress](https://img.shields.io/badge/WordPress-5.0+-blue.svg)
![PHP](https://img.shields.io/badge/PHP-8.1+-purple.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5+-blue.svg)
![React](https://img.shields.io/badge/React-18.3+-61DAFB.svg)
![License](https://img.shields.io/badge/License-Proprietary-red.svg)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Development](#development)
- [Building for Production](#building-for-production)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [HubSpot Email Template](#hubspot-email-template)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)

---

## Overview

wp-hubspot-edm-editor is an enterprise-grade WordPress plugin designed to streamline email newsletter creation and management. It bridges the gap between WordPress content management and HubSpot email marketing by providing:

- **Visual Email Editor**: A React-based drag-and-drop interface for building responsive email newsletters
- **WordPress Integration**: Pull blog posts, events, and custom post types directly into newsletters
- **HubSpot Sync**: Publish newsletter configurations to HubSpot HubDB tables for use in email templates
- **Responsive Preview**: Preview emails in both desktop and mobile views
- **Block-Based Design**: Modular block system for flexible email composition

---

## Features

### Email Blocks

| Block Type | Description |
| ------------ | ------------- |
| **Email Layout** | Container block defining email structure, background colors, and dimensions |
| **Columns Container** | Multi-column layout with configurable column widths |
| **Blog Post** | WordPress post integration with image, title, excerpt, and CTA button |
| **Heading** | Customizable headings with font controls and responsive sizing |
| **Text** | Rich text blocks with typography controls |
| **Image** | Image blocks with alt text, links, and responsive behavior |
| **Button** | Call-to-action buttons with customizable styling |
| **Divider** | Visual separators with color and sizing options |
| **HubSpot Header** | Reserved block for HubSpot email header modules |
| **HubSpot Footer** | Reserved block for HubSpot email footer/unsubscribe modules |

### Key Capabilities

- Drag-and-drop block editor
- Real-time preview with desktop/mobile viewport switching
- HubSpot HubDB synchronization
- Schema validation
- Role-based access control (Admin/Editor permissions)

---

## Architecture

### Technology Stack

#### Backend (PHP 8.1+)

- WordPress Plugin API
- PHP-DI for dependency injection
- HubSpot API Client v11
- PSR-4 autoloading with Composer

#### Frontend (TypeScript + React 18)

- React 18 with TypeScript 5.5+
- Zustand for state management
- TanStack Query (React Query) for server state
- Material UI 5 for components
- Zod for runtime validation
- Pragmatic Drag and Drop for DnD functionality

### Design Patterns

```text
┌─────────────────────────────────────────────────────────────┐
│                     WordPress Admin                         │
├─────────────────────────────────────────────────────────────┤
│                   React Application                         │
│  ┌───────────────┬─────────────────┬───────────────────┐    │
│  │   Components  │      Store      │   Infrastructure  │    │
│  │   (UI Layer)  │  (State Layer)  │    (API Layer)    │    │
│  └───────────────┴─────────────────┴───────────────────┘    │
├─────────────────────────────────────────────────────────────┤
│                    Domain Layer                             │
│          (Blocks, Schemas, Business Logic)                  │
├─────────────────────────────────────────────────────────────┤
│                 WordPress REST API                          │
├─────────────────────────────────────────────────────────────┤
│                PHP Backend (Controllers)                    │
├─────────────────────────────────────────────────────────────┤
│                  HubSpot HubDB API                          │
└─────────────────────────────────────────────────────────────┘
```

---

## Prerequisites

Before installation, ensure you have the following:

| Requirement | Version | Notes |
| ------------- | --------- | ------- |
| WordPress | 5.0+ | Tested up to 6.x |
| PHP | 8.1+ | With JSON extension |
| Composer | 2.0+ | PHP dependency manager |
| Node.js | 18.0+ | LTS version recommended |
| npm | 9.0+ | Or yarn 1.22+ |
| HubSpot Account | - | With CMS Hub access for HubDB |

---

## Installation

### Step 1: Clone the Repository

```bash
cd /path/to/wordpress/wp-content/plugins/
git clone https://github.com/wp-hubspot-edm-editor/wp-hubspot-edm-editor.git
cd wp-hubspot-edm-editor
```

### Step 2: Install PHP Dependencies

```bash
composer install
```

This installs:

- `hubspot/api-client` - Official HubSpot PHP SDK
- `php-di/php-di` - Dependency injection container

### Step 3: Install Node.js Dependencies

```bash
cd assets
npm install
```

This installs all frontend dependencies including React, Material UI, and build tools.

### Step 4: Build Frontend Assets

For **production** build:

```bash
npm run build
```

For **development** with hot reloading:

```bash
npm run dev
```

> ⚠️ **Important**: The plugin will not function without building the assets. If assets are not built, you'll see an error: "Required asset file not found. Please run `npm run build:dashboard` for this plugin."

### Step 5: Activate the Plugin

1. Navigate to **WordPress Admin → Plugins**
2. Find "wp-hubspot-edm-editor" in the list
3. Click **Activate**

---

## Configuration

### HubSpot API Setup

1. Navigate to **WordPress Admin → wp-hubspot-edm-editor**
2. Enter your HubSpot Private App Access Token
3. Click **Validate** to verify the connection
4. Create a new HubDB table or connect to an existing one

#### Obtaining a HubSpot Access Token

1. Log into your [HubSpot Account](https://app.hubspot.com)
2. Navigate to **Settings → Integrations → Private Apps**
3. Create a new Private App with the following scopes:
   - `cms.hubdb.tables.read`
   - `cms.hubdb.tables.write`
4. Copy the generated access token

### WordPress Settings

The plugin stores configuration in the WordPress options table under `wp-hubspot-edm-editor_data`:

```php
[
    'hubspotAccessToken' => '',  // HubSpot API token
    'hubspotTableId' => '',      // HubDB table ID
    'hubspotTableName' => '',    // HubDB table name
    'postTypes' => ['post'],     // Enabled WordPress post types
]
```

---

## Development

### Running the Development Server

```bash
cd assets
npm run dev
```

This starts webpack in watch mode with hot module reloading. Changes to TypeScript/React files will automatically rebuild.

### Project Scripts

| Script | Command | Description |
| -------- | --------- | ------------- |
| Development | `npm run dev` | Start webpack dev server with HMR |
| Production Build | `npm run build` | Build optimized production assets |
| Format Code | `npm run format` | Format source files with wp-scripts |

### Testing

#### Frontend (Vitest)

```bash
cd assets
npm install
npm test
```

---

## TODOs (Production)

- TODO: Use `wp-hubspot-edm-editor_data.postTypes` as the single source of truth for the BlogPost block dropdown (render choices from settings, not from runtime detection alone).
- TODO: Add an admin settings UI to curate the allowed WordPress post types and persist them to `wp-hubspot-edm-editor_data.postTypes`.
- TODO: Handle drift when post types are removed/renamed in WordPress (e.g., warn and auto-clean settings).
- TODO: Remove the HubSpot SDK and use the HubSpot REST API directly to reduce dependency and simplify maintenance.

## Building for Production

### Full Production Build

```bash
# From project root
composer install --no-dev --optimize-autoloader

# Build frontend assets
cd assets
npm ci
npm run build
```

### Output Files

After building, the following files are generated in `assets/public/`:

| File | Description |
| ------ | ------------- |
| `scripts.js` | Bundled JavaScript application |
| `scripts.css` | Compiled CSS styles |
| `scripts-rtl.css` | RTL language support styles |
| `scripts.asset.php` | WordPress asset dependencies |

---

## Project Structure

```text
wp-hubspot-edm-editor/
├── index.php                    # Plugin entry point
├── composer.json                # PHP dependencies
├── assets/                      # Frontend application
│   ├── package.json                # Node.js dependencies
│   ├── tsconfig.json               # TypeScript configuration
│   ├── webpack.config.js           # Webpack bundler config
│   │
│   ├── __tests__/                # Frontend tests (Vitest)
│   ├── application/             # React application layer
│   │   ├── App.tsx                 # Root component
│   │   ├── scripts.tsx             # Entry point
│   │   ├── theme.ts                # MUI theme configuration
│   │   ├── components/             # UI components
│   │   │   ├── blocks/               # Render-only block components
│   │   │   ├── editor/               # Main editor components
│   │   │   ├── inspector-drawer/     # Block property panels
│   │   │   ├── setup/                # HubSpot setup UI
│   │   │   └── toolbar/              # Editor toolbar
│   │   ├── pages/                  # Page components
│   │   └── store/                  # Zustand state management
│   │
│   ├── domain/                  # Business logic layer
│   │   ├── types.ts                # Domain type definitions
│   │   ├── blocks/                 # Block definitions & schemas
│   │   └── document/               # Document utilities
│   │
│   ├── infrastructure/          # External integrations
│   │   ├── client.ts               # API client
│   │   ├── newsletter/             # HubSpot API integration
│   │   └── wordpress/              # WordPress API integration
│   │
│   └── lib/                     # Utility libraries
│       ├── format.ts               # Formatting helpers
│       └── queryKeyFactory.ts      # Query key helpers
│
├── includes/                 # PHP backend
│   ├── Core/                   # Core plugin functionality
│   │   ├── Bootstrap.php         # Plugin initialization
│   │   ├── Config.php            # DI container config
│   │   └── Router.php            # REST API routes
│   │
│   ├── Admin/               # WordPress admin
│   │   ├── Menu.php            # Admin menu registration
│   │   └── Settings.php        # Settings registration
│   │
│   └── Newsletter/          # Newsletter module
│       ├── Config/             # Module configuration
│       ├── Controller/         # REST controllers
│       ├── Model/              # Data models
│       └── Service/            # HubSpot service layer
│
├── sample/                  # Sample templates
│   └── email-template.html     # HubSpot HubL email template
│
└── vendor/                  # Composer dependencies
```

---

## API Reference

### REST Endpoints

All endpoints are registered under the namespace `wp-hubspot-edm-editor/v1`.

| Endpoint | Method | Permission | Description |
| ---------- | -------- | ------------ | ------------- |
| `/newsletter/validate` | POST | `manage_options` | Validate HubSpot API key |
| `/newsletter/create` | POST | `manage_options` | Create HubDB table |
| `/newsletter/fetch` | GET | `edit_posts` | Fetch newsletter data |
| `/newsletter/update` | POST | `edit_posts` | Update newsletter blocks |

### Request/Response Examples

#### Validate API Key

```bash
POST /wp-json/wp-hubspot-edm-editor/v1/newsletter/validate
Content-Type: application/json

{
  "apiKey": "pat-na1-xxxxxxxx"
}
```

#### Update Newsletter

```bash
POST /wp-json/wp-hubspot-edm-editor/v1/newsletter/update
Content-Type: application/json

{
  "blocks": {
    "block-uuid-1": {
      "type": "EmailLayout",
      "data": { ... }
    }
  }
}
```

---

## HubSpot Email Template

This plugin syncs newsletter block configurations to HubSpot HubDB tables. To render these blocks as emails, you need a HubL (HubSpot Markup Language) email template in your HubSpot Design Manager.

A complete sample template is included at [sample/email-template.html](sample/email-template.html).

### How It Works

```text
┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
│   WordPress EDM     │────▶│   HubSpot HubDB     │────▶│   HubL Template     │
│   (Block Editor)    │     │   (Data Storage)    │     │   (Email Render)    │
└─────────────────────┘     └─────────────────────┘     └─────────────────────┘
```

1. **Design** your newsletter in the WordPress EDM block editor
2. **Publish** saves block configurations to a HubSpot HubDB table
3. **HubL template** reads the HubDB table and renders the email HTML

### Template Structure

The HubL template consists of several key sections:

#### Data Layer

Fetches block data from HubDB and extracts layout configuration:

```jinja
{% set table_rows = hubdb_table_rows("your-table-id") %}
{% set root_row = table_rows|selectattr("block_id", "equalto", "root")|first %}
{% set root_data = root_row.block_data|fromjson %}
```

#### Utility Macros

Helper functions for converting block schema values to CSS:

```jinja
{% macro get_font_family(key) %}
  {% if key == "MODERN_SANS" %}Arial, Helvetica, sans-serif
  {% elif key == "CLASSIC_SERIF" %}Georgia, Times, serif
  {% elif key == "MONOSPACE" %}'Courier New', monospace
  {% endif %}
{% endmacro %}

{% macro get_font_size(key) %}
  {% if key == "xs" %}11px{% elif key == "s" %}13px{% elif key == "m" %}15px
  {% elif key == "l" %}18px{% elif key == "xl" %}24px{% elif key == "xxl" %}32px
  {% endif %}
{% endmacro %}
```

#### Block Macros

Render functions for each block type that generate email-safe HTML:

```jinja
{% macro render_text(data, global_font) %}
  {% set typo = data.typography %}
  {% set layout = data.layout %}
  <table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td style="padding: {{ layout.padding.top }}px {{ layout.padding.right }}px 
                 {{ layout.padding.bottom }}px {{ layout.padding.left }}px;">
        <p style="font-family: {{ get_font_family(typo.fontFamily) }}; 
                  font-size: {{ get_font_size(typo.fontSize) }};">
          {{ data.content }}
        </p>
      </td>
    </tr>
  </table>
{% endmacro %}
```

#### Layout System

Handles the column-based layout structure with mobile responsiveness:

```jinja
{% macro render_columns_container(container_row, all_rows, global_font) %}
  {% set data = container_row.block_data|fromjson %}
  {% set widths = data.widths %}
  {% set children_ids = data.childrenIds %}
  
  <table class="mobile-full-width">
    <tr>
      {% for col_idx in range(children_ids|length) %}
        <td width="{{ widths[col_idx] }}" class="mobile-stack">
          {% for child_id in children_ids[col_idx] %}
            {{ render_block(child_id) }}
          {% endfor %}
        </td>
      {% endfor %}
    </tr>
  </table>
{% endmacro %}
```

### Deploying to HubSpot

1. Navigate to **HubSpot → Marketing → Design Manager**
2. Create a new **Email Template** file
3. Copy the contents of `sample/sample-email-template.hubl`
4. Update the `hubdb_table_rows("your-table-id")` call with your actual HubDB table ID
5. Save and publish the template
6. Use the template when creating new marketing emails in HubSpot

### Email Client Compatibility

The template includes comprehensive email client support:

- **Outlook (MSO)**: VML fallbacks for buttons and rounded corners
- **Apple Mail**: Disable message reformatting
- **Mobile**: Responsive breakpoints at 620px

---

## Contributing

### Code Standards

- **TypeScript**: Strict mode enabled, ESLint rules apply
- **React**: Functional components with hooks
- **State**: Use Zustand store for global state

---

## Troubleshooting

### Common Issues

#### "Required asset file not found"

**Cause**: Frontend assets have not been built.

**Solution**:

```bash
cd assets
npm install
npm run build
```

#### HubSpot API Connection Failed

**Cause**: Invalid or expired access token.

**Solution**:

1. Verify token in HubSpot Private Apps settings
2. Ensure required scopes are enabled
3. Re-enter token in plugin settings

#### Blocks Not Saving

**Cause**: HubDB table not configured.

**Solution**:

1. Navigate to wp-hubspot-edm-editor settings
2. Create a new HubDB table or enter existing table ID
3. Ensure table has proper column structure

---

## Support

For support inquiries, please contact the development team or open an issue in the repository.

**Author**: Joshua Levinson  
**Version**: 1.1.2
