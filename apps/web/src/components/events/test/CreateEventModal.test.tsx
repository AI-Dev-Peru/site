
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CreateEventModal } from '../CreateEventModal'
import { createTestWrapper } from '@/test/client'
import { eventsRepository } from '@/lib/dataSource'
import { FakeEventRepository } from '@/test/doubles/FakeEventRepository'

describe('CreateEventModal', () => {
    let fakeEventsRepo: FakeEventRepository
    const onClose = vi.fn()

    beforeEach(() => {
        fakeEventsRepo = eventsRepository as unknown as FakeEventRepository
        fakeEventsRepo.givenEvents([])
        vi.clearAllMocks()
    })

    it('should allow creating an event with exact date and time', async () => {
        render(<CreateEventModal isOpen={true} onClose={onClose} />, { wrapper: createTestWrapper() })

        fireEvent.change(screen.getByPlaceholderText(/e.g. AI Dev Peru Meetup #4/), { target: { value: 'Test Event' } })
        fireEvent.click(screen.getByText('Create Event'))

        await waitFor(async () => {
            const events = await fakeEventsRepo.getEvents()
            expect(events).toHaveLength(1)
            expect(events[0].title).toBe('Test Event')
            expect(events[0].isDateUnsure).toBeFalsy()
        })
    })

    it('should disable time input when "Fecha tentativa" is checked', async () => {
        render(<CreateEventModal isOpen={true} onClose={onClose} />, { wrapper: createTestWrapper() })

        const checkbox = screen.getByLabelText(/Fecha tentativa/)
        const timeInput = screen.getByLabelText(/Time/i) // Assuming label text matches or using other selector

        // Initially enabled
        expect(timeInput).toBeEnabled()

        // Check checkbox
        fireEvent.click(checkbox)

        // Should be disabled
        expect(timeInput).toBeDisabled()
    })

    it('should create event with isDateUnsure true and empty time when checked', async () => {
        render(<CreateEventModal isOpen={true} onClose={onClose} />, { wrapper: createTestWrapper() })

        fireEvent.change(screen.getByPlaceholderText(/e.g. AI Dev Peru Meetup #4/), { target: { value: 'Tentative Event' } })

        const checkbox = screen.getByLabelText(/Fecha tentativa/)
        fireEvent.click(checkbox)

        fireEvent.click(screen.getByText('Create Event'))

        await waitFor(async () => {
            const events = await fakeEventsRepo.getEvents()
            expect(events).toHaveLength(1)
            expect(events[0].title).toBe('Tentative Event')
            expect(events[0].isDateUnsure).toBe(true)
            expect(events[0].time).toBe('')
        })
    })
})
