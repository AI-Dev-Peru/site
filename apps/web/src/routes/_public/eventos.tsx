import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { usePublishedEvents } from '@/features/events/hooks'
import { Calendar, MapPin, ExternalLink, Clock } from 'lucide-react'
import { type Event } from '@/features/events/types'

export const Route = createFileRoute('/_public/eventos')({
    component: UpcomingEvents,
})

function UpcomingEvents() {
    const { data: events, isLoading } = usePublishedEvents()

    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-black pt-32 pb-20 px-6 relative overflow-hidden"
        >
            {/* Background Mesh */}
            <div className="absolute inset-0 mesh-gradient opacity-20 pointer-events-none" />
            <div className="absolute inset-0 bg-grainy opacity-50" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
                        Próximos <span className="text-electric-violet">Eventos</span>
                    </h1>
                    <p className="text-zinc-400 text-lg max-w-2xl">
                        Conéctate con la comunidad, aprende de expertos y comparte tus experiencias.
                    </p>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-64 bg-zinc-900/50 rounded-2xl animate-pulse border border-zinc-800" />
                        ))}
                    </div>
                ) : events?.length === 0 ? (
                    <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-zinc-800/50 backdrop-blur-sm">
                        <Calendar className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">No hay eventos programados</h3>
                        <p className="text-zinc-500">Estamos cocinando algo increíble. ¡Vuelve pronto!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events?.map(event => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                )}
            </div>
        </motion.main>
    )
}

function EventCard({ event }: { event: Event }) {
    // Helper to get registration link
    const regLink = event.links?.find((l) => l.type === 'registration')?.url

    const formattedDate = event.isDateUnsure
        ? 'Fecha por definir'
        : new Date(event.date + 'T00:00:00').toLocaleDateString('es-PE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

    const formatTranslations = {
        'in-person': 'Presencial',
        'remote': 'Remoto',
        'hybrid': 'Híbrido'
    } as const

    const translatedFormat = formatTranslations[event.format]

    // Show CTA if agenda is empty
    const showProposeCTA = !event.agenda || event.agenda.length === 0

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative bg-zinc-900/50 border border-zinc-800 hover:border-electric-violet/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] hover:-translate-y-1"
        >
            <div className="p-6 flex flex-col h-full">
                <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                            <div className="text-electric-violet text-sm font-bold tracking-wider uppercase">
                                {translatedFormat}
                            </div>
                            <h3 className="text-xl font-bold text-white group-hover:text-electric-violet transition-colors line-clamp-2">
                                {event.title}
                            </h3>
                        </div>
                    </div>

                    <div className="space-y-2 text-zinc-400 text-sm">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-zinc-500" />
                            <span className="capitalize">{formattedDate}</span>
                        </div>
                        {!event.isDateUnsure && (
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-zinc-500" />
                                <span>{event.time}</span>
                            </div>
                        )}
                        {(event.format === 'in-person' || event.format === 'hybrid') && (
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-zinc-500" />
                                <span className="line-clamp-1">{event.location || 'TBD'}</span>
                            </div>
                        )}
                    </div>

                    {event.description && (
                        <p className="text-zinc-500 text-sm line-clamp-3">
                            {event.description}
                        </p>
                    )}
                </div>

                <div className="pt-6 mt-6 border-t border-zinc-800 space-y-3">
                    {showProposeCTA && (
                        <a
                            href={`/proponer-charla?eventId=${event.id}`}
                            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-zinc-800 text-zinc-300 font-bold hover:bg-zinc-700 hover:text-white transition-all text-sm border border-zinc-700"
                        >
                            <span>Proponer charla</span>
                        </a>
                    )}

                    {regLink ? (
                        <a
                            href={regLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white text-black font-bold hover:bg-electric-violet hover:text-white transition-all group-active:scale-95 text-sm"
                        >
                            <span>Registrarme</span>
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    ) : !showProposeCTA ? (
                        <button disabled className="w-full py-3 rounded-xl bg-zinc-800 text-zinc-500 font-bold text-sm cursor-not-allowed">
                            Próximamente
                        </button>
                    ) : null}
                </div>
            </div>
        </motion.div>
    )
}
