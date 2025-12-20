export interface User {
    id: string;
    email: string;
    name?: string;
    avatarUrl?: string;
}

export interface AuthRepository {
    currentUser: User | null;
    signInWithGoogle(): Promise<void>;
    signOut(): Promise<void>;
    onAuthStateChange(callback: (user: User | null) => void): () => void;
    isEmailAllowed(email: string): boolean;
}
