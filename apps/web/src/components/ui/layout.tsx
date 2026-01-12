import { Link } from '@tanstack/react-router'
import { Calendar, Users, BarChart3, Megaphone, LogOut, Terminal, Menu, X } from 'lucide-react'
import { useAuth } from '../../features/auth/AuthContext'
import { useState } from 'react'
import { Drawer } from './drawer'


export function Layout({ children }: { children: React.ReactNode }) {
    const { user, signOut } = useAuth()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

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
                        <Link to="/internal" className="flex items-center">
                            <img src="/logo.png" alt="AI Dev Peru" className="h-8 w-auto" />
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center gap-1">
                            <NavLink to="/internal" icon={Calendar} label="Events" activeOptions={{ exact: true }} />
                            <NavLink to="/internal/speakers" icon={Users} label="Speakers" />
                            <NavLink to="/internal/proposals" icon={Terminal} label="Proposals" />
                            <NavLink to="/internal/marketing" icon={Megaphone} label="Marketing" />
                            <NavLink to="/internal/analytics" icon={BarChart3} label="Analytics" />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Desktop User Profile */}
                        <div className="hidden md:block">
                            {user && (
                                <div className="flex items-center gap-3">
                                    <div className="flex flex-col items-end mr-1">
                                        <span className="text-xs font-semibold text-zinc-200">{user.name}</span>
                                        <span className="text-[10px] text-zinc-500 line-clamp-1">{user.email}</span>
                                    </div>
                                    {user.avatarUrl ? (
                                        <img
                                            src={user.avatarUrl}
                                            alt={user.name}
                                            className="w-8 h-8 rounded-full border border-white/10"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                                            <span className="text-[10px] font-bold text-indigo-400">
                                                {user.name?.substring(0, 2).toUpperCase() || '??'}
                                            </span>
                                        </div>
                                    )}
                                    <button
                                        onClick={() => signOut()}
                                        className="p-2 rounded-md text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                                        title="Log out"
                                    >
                                        <LogOut className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 text-zinc-400 hover:text-white"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <Drawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)}>
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Navigation</span>
                            <MobileNavLink to="/internal" icon={Calendar} label="Events" activeOptions={{ exact: true }} onClick={() => setIsMenuOpen(false)} />
                            <MobileNavLink to="/internal/speakers" icon={Users} label="Speakers" onClick={() => setIsMenuOpen(false)} />
                            <MobileNavLink to="/internal/proposals" icon={Terminal} label="Proposals" onClick={() => setIsMenuOpen(false)} />
                            <MobileNavLink to="/internal/marketing" icon={Megaphone} label="Marketing" onClick={() => setIsMenuOpen(false)} />
                            <MobileNavLink to="/internal/analytics" icon={BarChart3} label="Analytics" onClick={() => setIsMenuOpen(false)} />
                        </div>

                        {user && (
                            <div className="flex flex-col gap-4 pt-6 border-t border-white/10">
                                <div className="flex items-center gap-3">
                                    {user.avatarUrl ? (
                                        <img
                                            src={user.avatarUrl}
                                            alt={user.name}
                                            className="w-10 h-10 rounded-full border border-white/10"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                                            <span className="text-xs font-bold text-indigo-400">
                                                {user.name?.substring(0, 2).toUpperCase() || '??'}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-zinc-200">{user.name}</span>
                                        <span className="text-xs text-zinc-500">{user.email}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => signOut()}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-400 hover:bg-white/5 rounded-md transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Log out
                                </button>
                            </div>
                        )}
                    </div>
                </Drawer>
            </nav>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function NavLink({ to, icon: Icon, label, activeOptions }: { to: string; icon: any; label: string; activeOptions?: { exact?: boolean } }) {
    return (
        <Link
            to={to}
            activeOptions={activeOptions}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors [&.active]:text-white [&.active]:bg-zinc-800"
        >
            <Icon className="w-4 h-4" />
            {label}
        </Link>
    )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function MobileNavLink({ to, icon: Icon, label, activeOptions, onClick }: { to: string; icon: any; label: string; activeOptions?: { exact?: boolean }, onClick: () => void }) {
    return (
        <Link
            to={to}
            activeOptions={activeOptions}
            onClick={onClick}
            className="flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors [&.active]:text-white [&.active]:bg-zinc-800"
        >
            <Icon className="w-5 h-5" />
            {label}
        </Link>
    )
}
