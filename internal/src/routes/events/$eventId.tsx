import { createFileRoute } from '@tanstack/react-router'
import { EventDetail } from '../../components/events/EventDetail'

export const Route = createFileRoute('/events/$eventId')({
    component: EventDetail,
})
