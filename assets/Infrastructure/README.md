# Infrastructure Layer

The Infrastructure layer handles external integrations and IO. It wraps API
clients and data transformations for WordPress/HubSpot services.

## Responsibilities

- API clients and DTOs
- Remote data fetching and persistence
- Translating external data into Domain-friendly shapes

## Non-Responsibilities

- UI rendering (Application)
- Defining business rules/logic or schemas (Domain)

## Key Areas

- `WordPress/`: WordPress REST client and transforms
- `Newsletter/`: HubSpot HubDB integration
- `client.ts`: shared API client setup
