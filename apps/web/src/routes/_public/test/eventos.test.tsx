import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { Route } from '../eventos'
import { createTestWrapper } from '@/test/client'
import { type Event } from '@/features/events/types'
import { eventsRepository } from '@/lib/dataSource'
import { FakeEventRepository } from '@/test/doubles/FakeEventRepository'

const UpcomingEvents = Route.options.component as React.ComponentType

describe('UpcomingEvents Page', () => {
    let fakeEventsRepo: FakeEventRepository

    beforeEach(() => {
        fakeEventsRepo = eventsRepository as unknown as FakeEventRepository
        vi.clearAllMocks()
    })

    const mockEvent: Event = {
        id: 'evt-1',
        title: 'Community Meetup',
        date: '2024-05-20',
        time: '19:00',
        format: 'in-person',
        status: 'published',
        description: 'A great event',
        location: 'Lima',
        agenda: [{ id: '1', title: 'Intro', speakerName: 'Host' }],
        links: []
    }

    it('should show loading state', async () => {
        fakeEventsRepo.givenEvents([mockEvent]) // Data doesn't matter for initial load check

        render(<UpcomingEvents />, { wrapper: createTestWrapper() })

        // The repository has artificial delay, so we should see skeletons immediately
        const skeletons = document.querySelectorAll('.animate-pulse')
        expect(skeletons.length).toBeGreaterThan(0)

        // Cleanup: wait for finish to avoid act warnings
        await waitFor(() => expect(screen.queryByText('Community Meetup')).toBeInTheDocument(), { timeout: 2000 })
    })

    it('should show empty state when no events found', async () => {
        fakeEventsRepo.givenEvents([])

        render(<UpcomingEvents />, { wrapper: createTestWrapper() })

        await waitFor(() => {
            expect(screen.getByText('No hay eventos programados')).toBeInTheDocument()
        }, { timeout: 2000 })
    })

    it('should render event cards', async () => {
        fakeEventsRepo.givenEvents([mockEvent])

        render(<UpcomingEvents />, { wrapper: createTestWrapper() })

        await waitFor(() => {
            expect(screen.getByText(mockEvent.title)).toBeInTheDocument()
            expect(screen.getByText(mockEvent.description!)).toBeInTheDocument()
        }, { timeout: 2000 })
    })

    it('should show tentative date format when isDateUnsure is true', async () => {
        const tentativeEvent: Event = {
            ...mockEvent,
            isDateUnsure: true
        }
        fakeEventsRepo.givenEvents([tentativeEvent])

        render(<UpcomingEvents />, { wrapper: createTestWrapper() })

        await waitFor(() => {
            expect(screen.getByText(/\(fecha por definir\)/)).toBeInTheDocument()
        }, { timeout: 2000 })
    })

    it('should show "Proponer charla" CTA when agenda is empty', async () => {
        const eventNoAgenda: Event = {
            ...mockEvent,
            agenda: [] // Empty
        }
        fakeEventsRepo.givenEvents([eventNoAgenda])

        render(<UpcomingEvents />, { wrapper: createTestWrapper() })

        await waitFor(() => {
            const proposeLink = screen.getByRole('link', { name: /Proponer charla/i })
            expect(proposeLink).toBeInTheDocument()
            expect(proposeLink).toHaveAttribute('href', `/proponer-charla?eventId=${eventNoAgenda.id}`)
        }, { timeout: 2000 })
    })

    it('should NOT show "Proponer charla" CTA when agenda exists', async () => {
        fakeEventsRepo.givenEvents([mockEvent]) // Has agenda

        render(<UpcomingEvents />, { wrapper: createTestWrapper() })

        await waitFor(() => {
            // Wait for content to load first
            expect(screen.getByText(mockEvent.title)).toBeInTheDocument()
        }, { timeout: 2000 })

        const proposeLink = screen.queryByRole('link', { name: /Proponer charla/i })
        expect(proposeLink).not.toBeInTheDocument()
    })
})
