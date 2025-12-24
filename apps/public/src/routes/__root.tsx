import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Navigation } from '../components/Navigation'

export const Route = createRootRoute({
    component: () => (
        <>
            <Navigation />
            <Outlet />
            <footer className="py-20 border-t border-white/5 relative z-10 bg-deep-space">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2">
                        <img src="/logo.png" alt="AI Dev Peru Assets" className="h-8 w-auto opacity-50 grayscale hover:grayscale-0 transition-all" />
                        <span className="font-display font-bold text-white/40">© 2025</span>
                    </div>

                    <div className="flex gap-8 text-sm font-medium text-white/20">
                        <a href="#" className="hover:text-white/60 transition-colors">Twitter</a>
                        <a href="#" className="hover:text-white/60 transition-colors">LinkedIn</a>
                        <a href="#" className="hover:text-white/60 transition-colors">Discord</a>
                        <a href="#" className="hover:text-white/60 transition-colors">Código de Conducta</a>
                    </div>
                </div>
            </footer>
        </>
    ),
})
