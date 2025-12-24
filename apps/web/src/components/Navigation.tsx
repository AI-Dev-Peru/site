import { motion } from "framer-motion";
import { cn } from "../lib/design-system";
import { Link } from "@tanstack/react-router";

export function Navigation() {
    return (
        <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto backdrop-blur-sm"
        >
            <div className="flex items-center gap-2">
                <Link to="/">
                    <img src="/logo.png" alt="AI Dev Peru Assets" className="h-10 w-auto" />
                </Link>
            </div>

            <div className="flex items-center gap-8">
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
                    <Link to="/eventos" className="hover:text-white transition-colors">Eventos</Link>
                    <Link to="/" hash="nosotros" className="hover:text-white transition-colors">Nosotros</Link>
                    <Link to="/" hash="speaker" className="hover:text-white transition-colors">Ser Speaker</Link>
                </nav>

                <a
                    href="https://ai-dev-peru.kit.com/bfdfeff5d9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                        "px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300",
                        "bg-white text-black hover:bg-electric-violet hover:text-white hover:scale-105 active:scale-95"
                    )}
                >
                    Suscríbete
                </a>
            </div>
        </motion.nav>
    );
}
