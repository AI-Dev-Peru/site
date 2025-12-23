import { SupabaseClient, User as SupabaseUser } from "@supabase/supabase-js";
import { getSupabase } from "../../supabase";
import { AuthRepository, User } from "../../repositories/AuthRepository";

export class SupabaseAuthRepository implements AuthRepository {
    private client: SupabaseClient;
    currentUser: User | null = null;
    private listeners: ((user: User | null) => void)[] = [];

    constructor() {
        this.client = getSupabase();
        // Initialize state

        // Initialize state
        this.client.auth.getUser().then(({ data }) => {
            this.currentUser = this.mapUser(data.user);
            this.notifyListeners();
        });

        // Listen for changes
        this.client.auth.onAuthStateChange((_event, session) => {
            this.currentUser = this.mapUser(session?.user ?? null);
            this.notifyListeners();
        });
    }

    async signInWithGoogle(): Promise<void> {
        const { error } = await this.client.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin
            }
        });

        if (error) throw error;
    }

    async signOut(): Promise<void> {
        const { error } = await this.client.auth.signOut();
        if (error) throw error;
    }

    onAuthStateChange(callback: (user: User | null) => void): () => void {
        this.listeners.push(callback);
        // Immediate callback if we already have a user resolved (or null)
        // Note: The constructor async call might race this, but the onAuthStateChange listener 
        // in constructor handles updates. We do a best effort here.
        if (this.currentUser) {
            callback(this.currentUser);
        }

        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    private notifyListeners() {
        this.listeners.forEach(l => l(this.currentUser));
    }

    private mapUser(sbUser: SupabaseUser | null): User | null {
        if (!sbUser) return null;
        return {
            id: sbUser.id,
            email: sbUser.email!,
            name: sbUser.user_metadata?.full_name || sbUser.user_metadata?.name,
            avatarUrl: sbUser.user_metadata?.avatar_url
        };
    }
    isEmailAllowed(email: string): boolean {
        // Load allowed emails from environment variable
        const allowed = (import.meta.env.VITE_ALLOWED_EMAILS || '').split(',').filter(Boolean);
        if (allowed.length === 0) {
            console.warn('VITE_ALLOWED_EMAILS is empty. All access will be denied.');
            return false;
        }
        return allowed.includes(email);
    }
}
