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

# Testing Guidelines

This project follows a strict **"No Mocks"** testing philosophy. We prefer **Fakes** and **Integration Tests** over Mocking and Unit Tests.

## 1. Core Philosophy

-   **Avoid `vi.mock()` for application logic.**
    -   Do not mock invalid hooks (e.g., `vi.mock('../../hooks')`).
    -   Do not mock services or internal modules.
    -   Exceptions: `window.confirm`, `window.matchMedia`, or bulky 3rd party UI libraries that are hard to render in jsdom.
-   **Use Fakes for Data Access.**
    -   Instead of mocking the network or the data hook, we inject a "Fake" implementation of the Repository.
    -   This allows `useQuery` and `useMutation` to actually run, testing the integration of the React component with the data layer.
-   **Test User Interactions & End States.**
    -   Do not test "was this function called?".
    -   Test "after clicking this, did the UI update?" or "did the fake repository receive the data?".

## 2. Architecture: Repositories & Fakes

We use the Repository Pattern to abstract data access.

### The Interface
Every domain entity (Speaker, Event, Proposal) has a Repository interface.
`src/lib/repositories/ProposalRepository.ts`

### The Real Implementation
We typically have `Supabase...Repository`, `LocalStorage...Repository`, etc.

### The Fake Implementation (Test Double)
We create a `Fake...Repository` that usually extends the `InMemory...Repository`.
**Crucial:** The fake implementation must be **synchronous** (no artificial delays) to ensure tests are fast and reliable.

```typescript
// src/test/doubles/FakeProposalRepository.ts
import { InMemoryProposalRepository } from '@/lib/adapters/proposals/InMemoryProposalRepository';

export class FakeProposalRepository extends InMemoryProposalRepository {
    // Helper method for test setup
    givenProposals(proposals: TalkProposal[]) {
        this.proposals = proposals;
    }

    // Override to ensure synchronous execution
    override async getProposals(): Promise<TalkProposal[]> {
        return [...this.proposals];
    }
}
```

## 3. Dependency Injection

We use a central `dataSource.ts` to expose singleton instances of our repositories.
**Key Pattern:** We check `import.meta.env.MODE === 'test'` to automatically inject Fakes during testing.

```typescript
// src/lib/dataSource.ts
class DataSourceFactory {
    static createProposalRepository(): ProposalRepository {
        if (import.meta.env.MODE === 'test') {
            return new FakeProposalRepository();
        }
        // ... return real implementations
    }
}
```

## 4. Writing Tests

### Setup
1.  **Wrapper:** Use `createTestWrapper` (exported from `@/test/client`) to wrap your component in necessary providers (like `QueryClientProvider`).
2.  **Cast & Setup:** Import the singleton repository instance and cast it to its Fake type to access setup methods (like `given...`).
3.  **Isolation:** Generate fresh mock data *inside* your test or `beforeEach` to avoid state pollution between tests.

### Example

```tsx
// src/features/proposals/test/index.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { proposalsRepository } from '@/lib/dataSource';
import { FakeProposalRepository } from '@/test/doubles/FakeProposalRepository';
import { createTestWrapper } from '@/test/client';

describe('ProposalList', () => {
    let fakeRepo: FakeProposalRepository;

    beforeEach(() => {
        // 1. Reset Repository
        fakeRepo = proposalsRepository as unknown as FakeProposalRepository;
        
        // 2. Setup Data (State-based)
        fakeRepo.givenProposals([
            { id: '1', title: 'My Talk', status: 'proposed', ... }
        ]);
    });

    it('should show proposals', async () => {
        // 3. Render integrated component
        render(<ProposalList />, { wrapper: createTestWrapper() });

        // 4. Assert UI state (Wait for async data)
        await waitFor(() => {
             expect(screen.getByText('My Talk')).toBeInTheDocument();
        });
    });
});
```

## 5. Selectors & interactions

- Prefer `screen.getByRole('button', { name: "Name" })` over `getByText` where possible, but use `getByText` if the role is ambiguous or difficult to target.
- Use `waitFor` when asserting UI changes that happen after a Promise resolves (e.g. data fetching).

## 6. Definition of Done

**No feature is complete without tests.**
A task or feature request is only considered "Done" when:
1.  The implementation is complete.
2.  **Integration tests** (using Fakes) are written and passing.
3.  The tests verify the end-user behavior and critical paths.

