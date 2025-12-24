import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as authUtils from './authorization';

describe('Authorization Logic', () => {

    beforeEach(() => {
        vi.unstubAllEnvs();
    });

    it('should return false if email is undefined', () => {
        expect(authUtils.isEmailAllowed(undefined)).toBe(false);
    });

    it('should return true if email is in the allowed list', () => {
        vi.stubEnv('VITE_ALLOWED_EMAILS', 'admin@example.com,user@example.com');

        expect(authUtils.isEmailAllowed('admin@example.com')).toBe(true);
        expect(authUtils.isEmailAllowed('user@example.com')).toBe(true);
    });

    it('should return false if email is NOT in the allowed list', () => {
        vi.stubEnv('VITE_ALLOWED_EMAILS', 'admin@example.com');

        expect(authUtils.isEmailAllowed('hacker@example.com')).toBe(false);
    });

    it('should fail securely (return false) if allowed list is empty', () => {
        vi.stubEnv('VITE_ALLOWED_EMAILS', '');

        expect(authUtils.isEmailAllowed('anyone@example.com')).toBe(false);
    });
});
