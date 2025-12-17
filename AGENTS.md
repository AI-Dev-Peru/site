# AI Agent Guidelines - AI Dev Peru

## Core Principles

1.  **Decouple UI from Logic**:
    *   The frontend should be completely decoupled from the backend implementation details.
    *   Use the **Repository Pattern** or **Service Layer** to abstract data fetching.
    *   Components should receive data via props or hooks that return simple data structures, not SDK-specific objects (e.g., no Supabase response objects directly in components).

2.  **"Dumb" Views**:
    *   UI components should focus on presentation.
    *   Complex logic (filtering, sorting, transformation) should reside in hooks or utility functions, not inside the JSX.
    *   Use **TanStack Query** for data management, but wrap it in custom hooks (e.g., `useEvents()`, `useCreateEvent()`) to hide the query implementation.

3.  **Fake Data First**:
    *   Develop against **in-memory fake data sources** initially.
    *   Create a `services/api` directory with interfaces and a `MockApi` implementation.
    *   This allows for rapid UI iteration without waiting for backend setup and ensures true decoupling.
    *   The switch to Supabase should be as simple as swapping the `MockApi` for a `SupabaseApi` implementation that satisfies the same interface.

4.  **Aesthetics & UX**:
    *   Follow the **Deep Zinc Dark Mode** design system.
    *   Use `bg-zinc-950` for backgrounds, `zinc-900` for cards.
    *   Ensure hover states and transitions are smooth.
    *   Use semantic HTML.

5.  **Code Structure**:
    *   **Features**: Group code by feature (e.g., `features/events`, `features/speakers`) rather than by type (components, hooks).
    *   **Shared**: Common components go in `components/ui`.
    *   **Routing**: Use **TanStack Router** for type-safe routing.

## Tech Stack Specifics

*   **Runtime**: Bun
*   **Build**: Vite
*   **Framework**: React (TanStack Start/Router)
*   **Styling**: Tailwind CSS (Vanilla CSS for specific overrides if needed)
*   **State/Data**: TanStack Query
*   **Backend**: Supabase (eventually)

## Example: Decoupled Data Access

```typescript
// interface
export interface EventRepository {
  getEvents(): Promise<Event[]>;
  createEvent(event: NewEvent): Promise<Event>;
}

// mock implementation
export class InMemoryEventRepository implements EventRepository {
  private events: Event[] = [];
  async getEvents() { return this.events; }
  async createEvent(e) { ... }
}

// hook
export function useEvents() {
  const repo = useEventRepository(); // Context or DI
  return useQuery({ queryKey: ['events'], queryFn: () => repo.getEvents() });
}
```
