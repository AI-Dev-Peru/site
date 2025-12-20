import { createRootRoute, Outlet, useLocation } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Layout } from '../components/ui/layout'
import { AuthProvider } from '../features/auth/AuthProvider'
import { ProtectedRoute } from '../features/auth/ProtectedRoute'

function RootComponent() {
    const location = useLocation()
    const isLoginPage = location.pathname === '/login'

    return (
        <AuthProvider>
            {isLoginPage ? (
                <Outlet />
            ) : (
                <ProtectedRoute>
                    <Layout>
                        <Outlet />
                        <TanStackRouterDevtools />
                    </Layout>
                </ProtectedRoute>
            )}
        </AuthProvider>
    )
}

export const Route = createRootRoute({
    component: RootComponent,
})
