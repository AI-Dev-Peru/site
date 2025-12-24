import { InMemoryAuthRepository } from "./InMemoryAuthRepository";

const STORAGE_KEY = 'local_auth_user';

export class LocalStorageAuthRepository extends InMemoryAuthRepository {
    constructor() {
        super();
        this.hydrate();
    }

    private hydrate() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                this.currentUser = JSON.parse(stored);
            } catch (e) {
                console.error('Failed to parse fake user', e);
                localStorage.removeItem(STORAGE_KEY);
            }
        }
    }

    // Override to persist
    protected notifyListeners() {
        if (this.currentUser) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.currentUser));
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
        super.notifyListeners();
    }
}
