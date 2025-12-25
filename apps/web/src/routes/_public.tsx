import { createFileRoute, Outlet, Link } from '@tanstack/react-router'
import { Navigation } from '../components/Navigation'

export const Route = createFileRoute('/_public')({
    component: () => (
        <>
            <Navigation />
            <Outlet />
            <footer className="py-20 border-t border-white/5 relative z-10 bg-deep-space">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2">
                        <img src="/logo.png" alt="AI Dev Peru Assets" className="h-8 w-auto opacity-50 grayscale hover:grayscale-0 transition-all" />
                        <span className="font-display font-bold text-white/40">AI Dev Peru</span>
                    </div>

                    <div className="flex gap-8 text-sm font-medium text-white/20">
                        <a href="https://www.linkedin.com/company/ai-dev-peru" className="hover:text-white/60 transition-colors">LinkedIn</a>
                        <Link to="/codigo-de-conducta" className="hover:text-white/60 transition-colors">Código de Conducta</Link>
                        <Link to="/privacy-policy" className="hover:text-white/60 transition-colors">Política de Privacidad</Link>
                    </div>
                </div>
            </footer>
        </>
    ),
})
