import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { Users, Sparkles, BrainCircuit, TrendingUp } from "lucide-react";
import type { MouseEvent, ReactNode } from "react";
import { cn } from "../lib/design-system";

interface CommunityValue {
    icon: ReactNode;
    title: string;
    description: string;
    gradient: string;
}

const values: CommunityValue[] = [
    {
        icon: <Users className="w-8 h-8" />,
        title: "Meetups Mensuales",
        description: "Nos juntaremos todos los meses para compartir experiencias reales, desafíos técnicos y conectar con otros builders de la comunidad.",
        gradient: "from-blue-500 to-cyan-500"
    },
    {
        icon: <Sparkles className="w-8 h-8" />,
        title: "Mantente actualizado",
        description: "Cada meetup empezará con un recap de nuevos modelos y herramientas - ¡la IA avanza tan rápido, que nunca nos quedaremos sin temas!",
        gradient: "from-fuchsia-500 to-purple-500"
    },
    {
        icon: <BrainCircuit className="w-8 h-8" />,
        title: "Procesos y Mindset",
        description: "La IA ha cambiado nuestra forma de trabajar. Aprende cómo cada equipo está evolucionando sus procesos de desarrollo.",
        gradient: "from-emerald-500 to-green-500"
    },
    {
        icon: <TrendingUp className="w-8 h-8" />,
        title: "Evolución del Rol",
        description: "Navegamos juntos el futuro de nuestra carrera, explorando las habilidades que nos permitirán liderar en esta era.",
        gradient: "from-orange-500 to-yellow-500"
    }
];

function SpotlightCard({ value, index }: { value: CommunityValue, index: number }) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group relative border border-white/10 bg-white/[0.02] overflow-hidden rounded-2xl"
            onMouseMove={handleMouseMove}
        >
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(139, 92, 246, 0.15),
              transparent 80%
            )
          `,
                }}
            />
            <div className="relative h-full p-8 flex flex-col">
                <div className={cn(
                    "w-14 h-14 rounded-full flex items-center justify-center mb-6 bg-gradient-to-br opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500",
                    value.gradient
                )}>
                    <div className="text-white drop-shadow-md">
                        {value.icon}
                    </div>
                </div>

                <h3 className="text-2xl font-display font-bold mb-3 text-white group-hover:text-electric-violet transition-colors">
                    {value.title}
                </h3>

                <p className="text-white/50 leading-relaxed font-medium group-hover:text-white/80 transition-colors">
                    {value.description}
                </p>

                {/* Decorative Grid Line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
        </motion.div>
    );
}

export function Values() {
    return (
        <section className="py-32 px-6 max-w-7xl mx-auto relative cursor-default" id="comunidad">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                <div className="max-w-3xl">
                    <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 leading-tight">
                        MÁS ALLÁ DEL <span className="text-electric-violet">CÓDIGO</span>
                    </h2>
                    <p className="text-lg md:text-xl text-white/60 leading-relaxed">
                        En un mundo donde la IA escribe cada vez más código, <span className="text-white font-bold">¿donde quedamos nosotros?</span> ¿cómo evolucionará el desarrollo de software, y cómo podemos navegar en medio de estos cambios?
                    </p>
                </div>
                <div className="hidden md:block w-32 h-1 bg-white/10 rounded-full mb-2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {values.map((value, index) => (
                    <SpotlightCard key={value.title} value={value} index={index} />
                ))}
            </div>
        </section>
    );
}
