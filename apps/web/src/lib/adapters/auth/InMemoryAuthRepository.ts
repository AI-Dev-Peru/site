import { type AuthRepository, type User } from "../../repositories/AuthRepository";

export const FAKE_USER: User = {
    id: 'fake-user-123',
    email: 'fake-admin@devperu.org',
    name: 'Fake Admin',
    avatarUrl: 'https://ui-avatars.com/api/?name=Fake+Admin&background=random'
};

export class InMemoryAuthRepository implements AuthRepository {
    currentUser: User | null = null;
    protected listeners: ((user: User | null) => void)[] = [];

    async signInWithGoogle(): Promise<void> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        this.currentUser = FAKE_USER;
        this.notifyListeners();
    }

    async signOut(): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 200));
        this.currentUser = null;
        this.notifyListeners();
    }

    onAuthStateChange(callback: (user: User | null) => void): () => void {
        this.listeners.push(callback);
        // Immediate callback with current state
        callback(this.currentUser);

        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    protected notifyListeners() {
        this.listeners.forEach(l => l(this.currentUser));
    }

    isEmailAllowed(email: string): boolean {
        // Default behavior: allow the fake admin
        return email === FAKE_USER.email;
    }
}
