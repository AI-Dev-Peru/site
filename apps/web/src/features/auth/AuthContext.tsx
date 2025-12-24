import { createContext, useContext } from "react";
import { type User } from "../../lib/repositories/AuthRepository";

export interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAllowed: boolean;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
