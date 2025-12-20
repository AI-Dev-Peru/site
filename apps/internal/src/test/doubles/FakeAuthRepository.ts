import { InMemoryAuthRepository } from "../../lib/adapters/auth/InMemoryAuthRepository";
import { User } from "../../lib/repositories/AuthRepository";

export class FakeAuthRepository extends InMemoryAuthRepository {
    private allowedEmails: string[] = [];

    /**
     * Test Helper: Set the specific user to be returned
     */
    setFakeUser(user: User | null) {
        this.currentUser = user;
        this.notifyListeners();
    }

    /**
     * Test Helper: Configure allowed emails list
     */
    setAllowedEmails(emails: string[]) {
        this.allowedEmails = emails;
    }

    // Override to check the configured list
    isEmailAllowed(email: string): boolean {
        return this.allowedEmails.includes(email);
    }
}
