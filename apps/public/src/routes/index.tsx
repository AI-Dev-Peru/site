import { createFileRoute } from '@tanstack/react-router'
import { Hero } from '../components/Hero'
import { Values } from '../components/Values'
import { SpeakerSection } from '../components/SpeakerSection'

export const Route = createFileRoute('/')({
    component: Home,
})

function Home() {
    return (
        <main className="relative min-h-screen bg-deep-space selection:bg-electric-violet/30 selection:text-white overflow-x-hidden">
            <Hero />
            <Values />
            <SpeakerSection />
        </main>
    )
}
