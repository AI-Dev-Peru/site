import { Link } from '@tanstack/react-router'
import { Calendar, Users, BarChart3, Megaphone } from 'lucide-react'

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div
            className="min-h-screen text-zinc-100 font-sans selection:bg-indigo-500/30"
            style={{
                background: 'radial-gradient(ellipse at top, rgba(99, 102, 241, 0.1) 0%, #09090b 50%, #000000 100%)',
                backgroundColor: '#09090b'
            }}
        >
            {/* Global Navigation */}
            <nav className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/80 backdrop-blur-md">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex items-center">
                            <img src="/logo.png" alt="AI Dev Peru" className="h-8 w-auto" />
                        </Link>

                        <div className="flex items-center gap-1">
                            <NavLink to="/" icon={Calendar} label="Events" />
                            <NavLink to="/speakers" icon={Users} label="Speakers" />
                            <NavLink to="/marketing" icon={Megaphone} label="Marketing" />
                            <NavLink to="/analytics" icon={BarChart3} label="Analytics" />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700" />
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    )
}

function NavLink({ to, icon: Icon, label }: { to: string; icon: any; label: string }) {
    return (
        <Link
            to={to}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors [&.active]:text-white [&.active]:bg-zinc-800"
        >
            <Icon className="w-4 h-4" />
            {label}
        </Link>
    )
}
