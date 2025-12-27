import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { animations, cn } from '../../lib/design-system'
import { Users, Calendar, Heart, Rocket, BrainCircuit } from 'lucide-react'

export const Route = createFileRoute('/_public/nosotros')({
    component: NosotrosPage,
})

function NosotrosPage() {
    return (
        <main className="relative min-h-screen bg-deep-space selection:bg-electric-violet/30 selection:text-white overflow-x-hidden pt-20">
            {/* Mesh Gradient Background - Consistent with Hero */}
            <div className="absolute inset-0 mesh-gradient opacity-20 pointer-events-none fixed" />
            <div className="absolute inset-0 bg-grainy fixed" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 pb-32">

                {/* Header Section */}
                <header className="mb-32 text-center max-w-4xl mx-auto">
                    <motion.div
                        variants={animations.fadeIn}
                        initial="initial"
                        animate="animate"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-electric-violet mb-8 uppercase tracking-wider"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-electric-violet opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-electric-violet"></span>
                        </span>
                        Nuestra Historia
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-5xl md:text-7xl font-display font-bold leading-[1.1] tracking-tighter mb-8"
                    >
                        Una comunidad unida para <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-violet to-blue-400">redefinir tu carrera</span>.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="text-lg md:text-xl text-white/60 leading-relaxed max-w-2xl mx-auto"
                    >
                        Creemos que la mejor forma de crecer es aprendiendo juntos. Compartimos conocimiento para que nadie se quede atrás en esta revolución tecnológica.
                    </motion.p>
                </header>

                {/* Origins Section */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative rounded-3xl overflow-hidden border border-white/10 aspect-video group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />

                        {/* Placeholder image for community */}
                        <img
                            src="/adp-event-group-photo-5.webp"
                            alt="Comunidad en un evento"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />

                        <div className="absolute bottom-6 left-6 z-20">
                            <p className="text-sm font-medium text-white/80 uppercase tracking-widest mb-1">El Origen</p>
                            <h3 className="text-2xl font-display font-bold text-white">Android Dev Peru</h3>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                            Un legado de <span className="text-electric-violet">10 años</span>
                        </h2>
                        <div className="space-y-6 text-white/60 text-lg leading-relaxed">
                            <p>
                                Esta comunidad fue fundada por las mismas personas que organizan <a href="https://androidperu.dev/" target="_blank" rel="noopener noreferrer" className="hover:text-electric-violet transition-colors"><strong className="text-white">Android Dev Peru</strong></a>, una de las comunidades más activas y grandes del país durante más de una década.
                            </p>
                            <p>
                                Hemos organizado eventos mensuales ininterrumpidamente, siempre con un único objetivo: <em className="text-white not-italic">compartir conocimiento libremente.</em>
                            </p>
                            <p>
                                Sin embargo, la IA no conoce barreras de tecnologías. Nos impacta a todos los desarrolladores por igual. Queremos llevar ese espíritu de colaboración al mundo de la IA.
                            </p>
                        </div>
                    </motion.div>
                </section>

                {/* Stats / Pillars Strip */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32"
                >
                    <StatCard
                        icon={<Calendar className="w-6 h-6" />}
                        value="10+ Años"
                        label="Organizando Eventos"
                        gradient="from-blue-500 to-cyan-500"
                    />
                    <StatCard
                        icon={<Heart className="w-6 h-6" />}
                        value="Non-Profit"
                        label="Eventos 100% gratuitos, siempre"
                        gradient="from-fuchsia-500 to-purple-500"
                    />
                    <StatCard
                        icon={<Users className="w-6 h-6" />}
                        value="Mensual"
                        label="Encuentros constantes"
                        gradient="from-emerald-500 to-green-500"
                    />
                </motion.div>

                {/* Mission Section */}
                <section className="max-w-5xl mx-auto text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-display font-bold mb-16"
                    >
                        Nuestra Misión
                    </motion.h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                        <MissionCard
                            icon={<Rocket className="w-8 h-8" />}
                            title="Level Up Your Game"
                            description="Queremos asegurar que cada miembro de la comunidad tenga acceso a las herramientas y conocimientos necesarios para elevar su nivel profesional y acceder a mejores oportunidades globales."
                            delay={0}
                        />
                        <MissionCard
                            icon={<BrainCircuit className="w-8 h-8" />}
                            title="Compartir Conocimiento"
                            description="Creemos en el código abierto y en el conocimiento abierto. Nadie se queda atrás. Fomentamos un entorno donde los seniors enseñan a los juniors y todos aprendemos de todos."
                            delay={0.2}
                        />
                    </div>
                </section>

            </div>
        </main>
    )
}

function StatCard({ icon, value, label, gradient }: { icon: React.ReactNode, value: string, label: string, gradient: string }) {
    return (
        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-4 hover:bg-white/[0.06] transition-colors group">
            <div className={cn("w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br text-white shadow-lg group-hover:scale-110 transition-transform duration-300", gradient)}>
                {icon}
            </div>
            <div>
                <div className="text-2xl font-bold font-display text-white">{value}</div>
                <div className="text-sm text-white/50 font-medium">{label}</div>
            </div>
        </div>
    )
}

function MissionCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.6 }}
            className="p-8 rounded-3xl bg-gradient-to-b from-white/[0.08] to-transparent border border-white/10 hover:border-white/20 transition-colors backdrop-blur-sm"
        >
            <div className="w-14 h-14 rounded-2xl bg-electric-violet/20 flex items-center justify-center text-electric-violet mb-6">
                {icon}
            </div>
            <h3 className="text-2xl font-bold font-display mb-4 text-white">{title}</h3>
            <p className="text-white/60 leading-relaxed">
                {description}
            </p>
        </motion.div>
    )
}
