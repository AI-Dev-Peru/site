import { useEffect, useState } from "react";
import { type User, type AuthRepository } from "../../lib/repositories/AuthRepository";
import { authRepository } from "../../lib/dataSource";
import { AuthContext } from "./AuthContext";

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
