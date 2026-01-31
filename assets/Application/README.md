# Application Layer

The Application layer contains the editor UI and orchestration logic. It wires
Domain schemas/types to React components, state management, and user workflows.

## Responsibilities
- Render blocks and editor UI (React components)
- Manage editor state via Zustand (document + UI slices)
- Coordinate interactions between UI and Domain rules
- Call Infrastructure APIs for data sync (via store actions)

## Non-Responsibilities
- Defining business rules or schemas (Domain)
- Owning external IO details (Infrastructure)

## Key Areas
- `components/`: React UI and editor components
- `components/Blocks/`: render-only block components
- `store/`: Zustand slices, actions, and editor state
