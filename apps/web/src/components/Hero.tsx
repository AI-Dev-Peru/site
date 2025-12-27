import { motion } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { animations, cn } from "../lib/design-system";
import { useState, useEffect } from "react";

// Dynamic code snippets for the background effect
const codeSnippets = [
    "import Future from 'ai-dev-peru';",
    "git push origin main",
    "npm install @ai/community",
    "while(alive) { learn(); }",
    "const event = new Meetup();",
    "python3 train_model.py",
    "docker-compose up -d",
    "sudo apt-get install knowledge",
    "console.log('Hello Lima!');",
    "await newEra.start();",
    "if (collaborate) { grow(); }",
    "<span>Community First</span>",
    "grep -r 'innovation' .",
    // Duplicates for density in the massive space
    "git commit -m 'feat: future'",
    "bun run dev",
    "echo 'Open Source'",
    "chmod +x run.sh",
];

function CodeParticle({ text }: { text: string }) {
    const [config, setConfig] = useState<{
        randomX: number;
        randomY: number;
        duration: number;
        delay: number;
        repeatDelay: number;
    } | null>(null);

    useEffect(() => {
        const frame = requestAnimationFrame(() => {
            setConfig({
                randomX: Math.random() * 100 - 50,
                randomY: Math.random() * 100 - 50,
                duration: 6 + Math.random() * 10,
                delay: Math.random() * 5,
                repeatDelay: Math.random() * 3
            });
        });
        return () => cancelAnimationFrame(frame);
    }, []);

    if (!config) return null;

    return (
        <motion.div
            initial={{ opacity: 0, x: config.randomX, y: config.randomY, scale: 0.8 }}
            animate={{
                opacity: [0, 0.4, 0],
                y: [config.randomY, config.randomY - 100],
                scale: [0.8, 1.2, 0.9]
            }}
            transition={{
                duration: config.duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: config.delay,
                repeatDelay: config.repeatDelay
            }}
            className="absolute whitespace-nowrap font-mono text-sm md:text-base text-electric-violet/20 z-0 pointer-events-none select-none font-bold mix-blend-screen"
            style={{
                left: "40%",
                top: "50%",
                x: `${config.randomX * 20}px`,
                y: `${config.randomY * 12}px`,
            }}
        >
            {text}
        </motion.div>
    );
}

export function Hero() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Use requestAnimationFrame to avoid cascading render warning in some strict linters
        const frame = requestAnimationFrame(() => setMounted(true));
        return () => cancelAnimationFrame(frame);
    }, []);

    return (
        <section className="relative min-h-screen flex flex-col lg:flex-row items-center justify-center px-6 overflow-hidden pt-32 pb-16 gap-12 lg:gap-0">
            {/* Mesh Gradient Background */}
            <div className="absolute inset-0 mesh-gradient opacity-40 pointer-events-none" />
            <div className="absolute inset-0 bg-grainy" />

            {/* Left Content */}
            <motion.div
                variants={animations.staggerContainer}
                initial="initial"
                animate="animate"
                className="relative z-10 flex-1 lg:pl-12"
            >
                <motion.div
                    variants={animations.fadeIn}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-electric-violet mb-8 uppercase tracking-wider"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-electric-violet opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-electric-violet"></span>
                    </span>
                    Ingeniería + IA
                </motion.div>

                <motion.h1
                    variants={animations.reveal}
                    className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-[0.9] tracking-tighter mb-8 whitespace-nowrap"
                >
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-violet to-blue-400">AI DEV</span>{" "}PERU
                </motion.h1>

                <motion.p
                    variants={animations.fadeIn}
                    className="text-lg md:text-xl text-white/60 max-w-xl mb-10 font-medium leading-relaxed"
                >
                    Comunidad para programadores, builders y líderes que reconocen que
                    <span className="text-electric-violet"> la IA está revolucionando </span> los procesos de desarrollo e ingeniería. Aprendamos juntos.
                </motion.p>

                <motion.div
                    variants={animations.fadeIn}
                    className="flex flex-col sm:flex-row items-center gap-4"
                >
                    <a
                        href="https://chat.whatsapp.com/FFCxB1vvvx61UgRKjLtEco"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                            "w-full sm:w-auto px-8 py-4 rounded-full bg-electric-violet text-white font-bold transition-all duration-300",
                            "hover:scale-105 hover:shadow-[0_0_40px_rgba(139,92,246,0.5)] active:scale-95 flex items-center justify-center gap-2"
                        )}
                    >
                        Únete a la comunidad
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </a>

                    <Link to="/eventos" className={cn(
                        "w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-bold transition-all duration-300",
                        "hover:bg-white/10 hover:border-white/20 active:scale-95 flex items-center justify-center gap-2"
                    )}>
                        <Calendar className="w-5 h-5" />
                        Próximos Eventos
                    </Link>
                </motion.div>
            </motion.div>

            {/* Right Content - Robot Visual */}
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
                className="flex-1 relative w-full max-w-xl lg:max-w-full flex justify-center items-center"
            >
                <div className="relative w-full aspect-square max-w-[600px] flex items-center justify-center">
                    {/* Glowing effects behind the robot */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-electric-violet/20 blur-[100px] rounded-full z-0" />

                    {/* Dynamic Code Particles Behind Robot */}
                    {mounted && codeSnippets.map((snippet) => (
                        <CodeParticle key={snippet} text={snippet} />
                    ))}

                    <img
                        src="/robot.png"
                        alt="AI Dev Peru Robot Mascot"
                        className="relative z-20 w-full h-full object-contain drop-shadow-[0_0_50px_rgba(139,92,246,0.2)]"
                    />
                </div>
            </motion.div>
        </section>
    );
}
