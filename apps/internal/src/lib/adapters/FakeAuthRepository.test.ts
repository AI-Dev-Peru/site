import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FakeAuthRepository } from '../../test/doubles/FakeAuthRepository';
import { FAKE_USER } from './InMemoryAuthRepository';

describe('FakeAuthRepository', () => {
    let repo: FakeAuthRepository;

    beforeEach(() => {
        repo = new FakeAuthRepository();
    });

    it('should start with no user', () => {
        expect(repo.currentUser).toBeNull();
    });

    it('should sign in with fake user and emit change', async () => {
        let emittedUser = null;
        repo.onAuthStateChange((user) => { emittedUser = user; });

        await repo.signInWithGoogle();

        expect(repo.currentUser).toEqual(FAKE_USER);
        expect(repo.currentUser?.email).toContain('fake');
        expect(emittedUser).toEqual(FAKE_USER);
    });

    it('should sign out', async () => {
        await repo.signInWithGoogle();
        expect(repo.currentUser).not.toBeNull();

        await repo.signOut();
        expect(repo.currentUser).toBeNull();
    });

    it('should allow setting fake user for tests', () => {
        const customUser = { id: '99', email: 'custom@example.com' };
        repo.setFakeUser(customUser);

        expect(repo.currentUser).toEqual(customUser);
    });

    it('should check allowlist correctly', () => {
        repo.setAllowedEmails(['allowed@example.com']);

        expect(repo.isEmailAllowed('allowed@example.com')).toBe(true);
        expect(repo.isEmailAllowed('denied@example.com')).toBe(false);
    });
});
