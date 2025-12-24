import { createFileRoute, Outlet, useLocation } from '@tanstack/react-router'
import { Layout } from '../components/ui/layout'
import { AuthProvider } from '../features/auth/AuthProvider'
import { ProtectedRoute } from '../features/auth/ProtectedRoute'

export const Route = createFileRoute('/internal')({
    component: InternalComp,
})



function InternalComp() {
    const location = useLocation()
    // We check if the current path is exactly /internal/login to skip the protected layout
    const isLoginPage = location.pathname === '/internal/login'

    return (
        <AuthProvider>
            {isLoginPage ? (
                <Outlet />
            ) : (
                <ProtectedRoute>
                    <Layout>
                        <Outlet />
                    </Layout>
                </ProtectedRoute>
            )}
        </AuthProvider>
    )
}
