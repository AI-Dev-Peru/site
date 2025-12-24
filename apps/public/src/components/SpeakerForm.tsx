import { motion } from "framer-motion";
import { useState } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "../lib/design-system";
import { proposalRepository } from "../lib/dataSource";

export function SpeakerForm() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        title: '',
        description: '',
        duration: '15' as '15' | '30',
        linkedin: '',
        github: '',
        twitter: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        try {
            await proposalRepository.submitProposal(formData);
            setStatus('success');
        } catch (error) {
            console.error('Error submitting proposal:', error);
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-xl mx-auto py-20 px-6 text-center"
            >
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-8">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                <h2 className="text-4xl font-display font-bold text-white mb-4">¡Propuesta Recibida!</h2>
                <p className="text-white/60 text-lg mb-8">
                    Gracias por querer compartir tu conocimiento. Revisaremos tu propuesta y nos pondremos en contacto contigo pronto.
                </p>
                <button
                    onClick={() => setStatus('idle')}
                    className="text-electric-violet font-bold hover:underline"
                >
                    Enviar otra propuesta
                </button>
            </motion.div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-20 px-6">
            <div className="mb-12">
                <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4 uppercase tracking-tighter">
                    Proponer <span className="text-electric-violet">Charla</span>
                </h1>
                <p className="text-white/40 text-lg">
                    Cuéntanos sobre lo que quieres compartir. Valoramos la profundidad técnica y la aplicabilidad práctica.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-white/60 uppercase tracking-widest pl-1">Nombre Completo *</label>
                        <input
                            required
                            type="text"
                            value={formData.fullName}
                            onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-electric-violet/50 transition-colors"
                            placeholder="John Doe"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-white/60 uppercase tracking-widest pl-1">Email *</label>
                        <input
                            required
                            type="email"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-electric-violet/50 transition-colors"
                            placeholder="john@example.com"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-white/60 uppercase tracking-widest pl-1">Teléfono / WhatsApp *</label>
                        <input
                            required
                            type="tel"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-electric-violet/50 transition-colors"
                            placeholder="+51 999 999 999"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-white/60 uppercase tracking-widest pl-1">Duración estimada *</label>
                        <select
                            required
                            value={formData.duration}
                            onChange={e => setFormData({ ...formData, duration: e.target.value as '15' | '30' })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-electric-violet/50 transition-colors"
                        >
                            <option value="15" className="bg-deep-space">Lightning Talk (15 mins)</option>
                            <option value="30" className="bg-deep-space">Standard Talk (30 mins)</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-white/60 uppercase tracking-widest pl-1">Título de la charla *</label>
                    <input
                        required
                        type="text"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-electric-violet/50 transition-colors"
                        placeholder="Ej: Construyendo agentes con LangChain"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-white/60 uppercase tracking-widest pl-1">Descripción de la charla *</label>
                    <textarea
                        required
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-electric-violet/50 transition-colors min-h-[150px]"
                        placeholder="Resume los puntos clave de tu presentación..."
                    />
                </div>

                <div className="space-y-4 pt-4 border-t border-white/5">
                    <p className="text-sm font-bold text-white/40 uppercase tracking-widest">Links y Perfiles (Opcional)</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="url"
                            value={formData.linkedin}
                            onChange={e => setFormData({ ...formData, linkedin: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-electric-violet/50 transition-colors"
                            placeholder="LinkedIn Profile URL"
                        />
                        <input
                            type="url"
                            value={formData.github}
                            onChange={e => setFormData({ ...formData, github: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-electric-violet/50 transition-colors"
                            placeholder="GitHub Profile URL"
                        />
                        <input
                            type="text"
                            value={formData.twitter}
                            onChange={e => setFormData({ ...formData, twitter: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-electric-violet/50 transition-colors"
                            placeholder="X (Twitter) Profile"
                        />
                    </div>
                </div>

                {status === 'error' && (
                    <div className="flex items-center gap-2 text-red-500 bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm font-medium">Hubo un error al enviar tu propuesta. Por favor intenta de nuevo.</p>
                    </div>
                )}

                <button
                    disabled={status === 'loading'}
                    type="submit"
                    className={cn(
                        "w-full py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2",
                        status === 'loading'
                            ? "bg-white/10 text-white/40 cursor-not-allowed"
                            : "bg-electric-violet text-white hover:scale-[1.02] active:scale-95 shadow-[0_0_30px_rgba(139,92,246,0.3)]"
                    )}
                >
                    {status === 'loading' ? 'Enviando...' : 'Enviar Propuesta'}
                    <Send className="w-5 h-5" />
                </button>
            </form>
        </div>
    );
}
