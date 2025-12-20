import { createContext, useContext, useEffect, useState } from "react";
import { User, AuthRepository } from "../../lib/repositories/AuthRepository";
import { authRepository } from "../../lib/dataSource";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAllowed: boolean;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: React.ReactNode;
    repository?: AuthRepository;
}

export function AuthProvider({ children, repository = authRepository }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(repository.currentUser);
    const [isLoading, setIsLoading] = useState(true);

    const isAllowed = user ? repository.isEmailAllowed(user.email) : false;

    useEffect(() => {
        const unsubscribe = repository.onAuthStateChange((user) => {
            setUser(user);
            setIsLoading(false);
        });
        return unsubscribe;
    }, [repository]);

    const signInWithGoogle = async () => {
        await repository.signInWithGoogle();
    };

    const signOut = async () => {
        await repository.signOut();
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, isAllowed, signInWithGoogle, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
