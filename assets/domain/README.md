# Domain Layer

The Domain layer defines the editor's core business rules and data contracts.
It contains schemas, types, and defaults for blocks and documents.

## Responsibilities

- Zod schemas and validation for blocks and documents
- Core types and defaults used by the editor
- Utilities that are framework-agnostic (no React/UI)

## Non-Responsibilities

- Rendering UI components (Application)
- Calling external services (Infrastructure)

## Key Areas

- `blocks/`: block schemas, types, and defaults
- `document/`: block registry utilities and document types
- `types.ts`: shared domain types
