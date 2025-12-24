import { Navigate } from "@tanstack/react-router";
import { useAuth } from "./AuthContext";
import { Lock } from "lucide-react";
import { Skeleton } from "../../components/ui/skeleton";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, isLoading, isAllowed, signOut } = useAuth();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-zinc-950">
                <div className="space-y-4 text-center">
                    <Skeleton className="h-12 w-12 rounded-full mx-auto" />
                    <Skeleton className="h-4 w-32 mx-auto" />
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/internal/login" />;
    }

    if (!isAllowed) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-zinc-950 text-white p-4">
                <div className="max-w-md w-full space-y-8 text-center">
                    <div className="flex justify-center">
                        <div className="p-3 bg-zinc-900 rounded-full border border-zinc-800">
                            <Lock className="w-8 h-8 text-zinc-400" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold tracking-tight">Access Denied</h2>
                        <p className="text-zinc-400">
                            Access Restricted: <span className="text-zinc-200 font-medium">{user.email}</span> is not authorized.
                        </p>
                    </div>

                    <button
                        onClick={() => signOut()}
                        className="w-full py-2.5 px-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-colors border border-zinc-700"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
