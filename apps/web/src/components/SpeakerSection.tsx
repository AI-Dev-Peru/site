import { motion } from "framer-motion";
import { Mic, ArrowRight } from "lucide-react";
import { animations } from "../lib/design-system";
import { Link } from "@tanstack/react-router";

export function SpeakerSection() {
    return (
        <section className="py-24 px-6 relative overflow-hidden bg-white/[0.01]" id="speaker">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-electric-violet/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        variants={animations.fadeIn}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                    >
                        <div className="w-16 h-16 rounded-2xl bg-electric-violet/10 flex items-center justify-center mb-6 border border-electric-violet/20">
                            <Mic className="w-8 h-8 text-electric-violet" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 leading-tight text-white">
                            QUIERO SER <span className="text-electric-violet">SPEAKER</span>
                        </h2>
                        <p className="text-lg md:text-xl text-white/60 leading-relaxed mb-8">
                            ¿Tienes una experiencia técnica, un desafío resuelto con IA o un nuevo workflow que quieras compartir? Buscamos contenido de calidad, técnico y pragmático para nuestra comunidad.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                to="/proponer-charla"
                                className="px-8 py-4 rounded-full bg-white text-black font-bold hover:bg-electric-violet hover:text-white transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group"
                            >
                                Proponer Charla
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="relative hidden md:block"
                    >
                        <div className="relative aspect-square md:aspect-auto md:h-[400px] rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent p-8 flex flex-col justify-center gap-6 group">
                            <div className="absolute inset-0 bg-electric-violet/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-electric-violet mb-2">Temas que nos emocionan</h3>

                            <div className="grid gap-3">
                                {[
                                    "Context Engineering",
                                    "Construcción de Agentes",
                                    "AI-powered development",
                                    "Modelos y herramientas emergentes",
                                ].map((topic, i) => (
                                    <motion.div
                                        key={topic}
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 + 0.5 }}
                                        className="flex items-center gap-3 py-3 px-4 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-white/10 transition-all duration-300"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-electric-violet shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
                                        <span className="text-white/80 font-medium">{topic}</span>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="mt-4 pt-6 border-t border-white/5 flex items-center justify-between text-[10px] uppercase tracking-widest text-white/20 font-bold">
                                <span>Formatos: 15' / 30'</span>
                                <span>Modalidad: Presencial / Virtual</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
