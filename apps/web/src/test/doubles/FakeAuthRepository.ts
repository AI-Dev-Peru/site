import { InMemoryAuthRepository } from '@/lib/adapters/auth/InMemoryAuthRepository';
import { type User } from '@/lib/repositories/AuthRepository';

export class FakeAuthRepository extends InMemoryAuthRepository {
    private allowedEmails: string[] = [];

    setFakeUser(user: User | null) {
        this.currentUser = user;
        this.notifyListeners();
    }

    setAllowedEmails(emails: string[]) {
        this.allowedEmails = emails;
    }

    override isEmailAllowed(email: string): boolean {
        if (this.allowedEmails.length === 0) return super.isEmailAllowed(email);
        return this.allowedEmails.includes(email);
    }
}
