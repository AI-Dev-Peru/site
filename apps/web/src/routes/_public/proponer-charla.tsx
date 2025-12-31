import { createFileRoute } from '@tanstack/react-router'
import { SpeakerForm } from '@/components/SpeakerForm'
import { motion } from 'framer-motion'
import { useEffect } from 'react'

export const Route = createFileRoute('/_public/proponer-charla')({
    validateSearch: (search: Record<string, unknown>): { eventId?: string } => {
        return {
            eventId: typeof search.eventId === 'string' ? search.eventId : undefined,
        }
    },
    component: ProponerCharla,
})

function ProponerCharla() {
    const { eventId } = Route.useSearch()

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative min-h-screen bg-deep-space pt-24"
        >
            {/* Background Mesh */}
            <div className="absolute inset-0 mesh-gradient opacity-20 pointer-events-none" />
            <div className="absolute inset-0 bg-grainy opacity-50" />

            <div className="relative z-10">
                <SpeakerForm eventId={eventId} />
            </div>
        </motion.main>
    )
}
