import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ProtectedRoute } from './ProtectedRoute';
import { AuthProvider } from './AuthProvider';
import { FakeAuthRepository } from '../../test/doubles/FakeAuthRepository';

// Only mock the Router, use real AuthProvider + Fakes for everything else
vi.mock('@tanstack/react-router', async () => {
    const actual = await vi.importActual('@tanstack/react-router');
    return {
        ...actual,
        Navigate: ({ to }: { to: string }) => <div data-testid="navigate">{to}</div>
    };
});

describe.skip('ProtectedRoute', () => {
    let repo: FakeAuthRepository;

    beforeEach(() => {
        vi.unstubAllEnvs();
        repo = new FakeAuthRepository();
        repo.setFakeUser(null);
    });

    it('should navigate to login if no user', async () => {
        // GIVEN: No user (default)

        render(
            <AuthProvider repository={repo}>
                <ProtectedRoute>Content</ProtectedRoute>
            </AuthProvider>
        );

        // Wait for AuthProvider to finish initializing
        await waitFor(() => {
            expect(screen.getByTestId('navigate')).toHaveTextContent('/login');
        });
    });

    it('should show access denied if user not allowed', async () => {
        // GIVEN: User logged in but email is NOT in allowed list
        repo.setFakeUser({ id: '1', email: 'bad@example.com', name: 'Bad User', avatarUrl: '' });
        repo.setAllowedEmails(['good@example.com']);

        render(
            <AuthProvider repository={repo}>
                <ProtectedRoute>Content</ProtectedRoute>
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByText('Access Denied')).toBeInTheDocument();
        });
        expect(screen.queryByText('Content')).not.toBeInTheDocument();
    });

    it('should render children if user is allowed', async () => {
        // GIVEN: User logged in AND email IS in allowed list
        repo.setFakeUser({ id: '1', email: 'good@example.com', name: 'Good User', avatarUrl: '' });
        repo.setAllowedEmails(['good@example.com']);

        render(
            <AuthProvider repository={repo}>
                <ProtectedRoute><div>Protected Content</div></ProtectedRoute>
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByText('Protected Content')).toBeInTheDocument();
        });
    });
});
