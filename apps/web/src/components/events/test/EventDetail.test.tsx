import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { EventEditor } from '../EventDetail'
import { createTestWrapper } from '@/test/client'
import { type Event } from '@/features/events/types'
import { eventsRepository } from '@/lib/dataSource'
import { FakeEventRepository } from '@/test/doubles/FakeEventRepository'
import * as router from '@tanstack/react-router'

vi.mock('@tanstack/react-router', () => ({
    useNavigate: vi.fn(),
    useParams: vi.fn(),
}))

describe('EventDetail - Unsaved Changes', () => {
    let fakeEventsRepo: FakeEventRepository
    const mockNavigate = vi.fn()

    const testEvent: Event = {
        id: 'test-event-1',
        title: 'Test Event',
        date: '2024-01-15',
        time: '18:00',
        format: 'in-person',
        location: 'Test Location',
        description: 'Test Description',
        status: 'draft',
        agenda: [],
        links: [],
    }

    beforeEach(() => {
        fakeEventsRepo = eventsRepository as unknown as FakeEventRepository
        fakeEventsRepo.givenEvents([testEvent])
        vi.mocked(router.useNavigate).mockReturnValue(mockNavigate)
        vi.clearAllMocks()
    })

    it('should have save button disabled initially when no changes are made', () => {
        render(<EventEditor event={testEvent} />, { wrapper: createTestWrapper() })

        const saveButton = screen.getByRole('button', { name: /save changes/i })
        expect(saveButton).toBeDisabled()
    })

    it('should enable save button after making a change', async () => {
        render(<EventEditor event={testEvent} />, { wrapper: createTestWrapper() })

        const saveButton = screen.getByRole('button', { name: /save changes/i })
        expect(saveButton).toBeDisabled()

        // Make a change to the title
        const titleInput = screen.getByDisplayValue('Test Event')
        fireEvent.change(titleInput, { target: { value: 'Updated Event Title' } })

        // Save button should now be enabled
        await waitFor(() => {
            expect(saveButton).toBeEnabled()
        })
    })

    it('should disable save button after saving changes', async () => {
        render(<EventEditor event={testEvent} />, { wrapper: createTestWrapper() })

        // Make a change
        const titleInput = screen.getByDisplayValue('Test Event')
        fireEvent.change(titleInput, { target: { value: 'Updated Event Title' } })

        const saveButton = screen.getByRole('button', { name: /save changes/i })
        await waitFor(() => {
            expect(saveButton).toBeEnabled()
        })

        // Click save
        fireEvent.click(saveButton)

        // Wait for save to complete and verify the event was updated
        await waitFor(async () => {
            const events = await fakeEventsRepo.getEvents()
            expect(events[0].title).toBe('Updated Event Title')
        })
    })

    it('should warn when clicking back button with unsaved changes', () => {
        const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false)

        render(<EventEditor event={testEvent} />, { wrapper: createTestWrapper() })

        // Make a change
        const titleInput = screen.getByDisplayValue('Test Event')
        fireEvent.change(titleInput, { target: { value: 'Updated Event Title' } })

        // Click back button
        const backButton = screen.getAllByRole('button')[0]
        fireEvent.click(backButton)

        // Should show confirmation dialog
        expect(confirmSpy).toHaveBeenCalledWith('You have unsaved changes. Are you sure you want to leave?')

        // Should not navigate
        expect(mockNavigate).not.toHaveBeenCalled()

        confirmSpy.mockRestore()
    })

    it('should navigate without warning when no unsaved changes', () => {
        const confirmSpy = vi.spyOn(window, 'confirm')

        render(<EventEditor event={testEvent} />, { wrapper: createTestWrapper() })

        // Click back button without making changes
        const backButton = screen.getAllByRole('button')[0]
        fireEvent.click(backButton)

        // Should not show confirmation dialog
        expect(confirmSpy).not.toHaveBeenCalled()

        // Should navigate
        expect(mockNavigate).toHaveBeenCalledWith({ to: '/internal' })

        confirmSpy.mockRestore()
    })

    it('should navigate when user confirms warning', () => {
        const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)

        render(<EventEditor event={testEvent} />, { wrapper: createTestWrapper() })

        // Make a change
        const titleInput = screen.getByDisplayValue('Test Event')
        fireEvent.change(titleInput, { target: { value: 'Updated Event Title' } })

        // Click back button
        const backButton = screen.getAllByRole('button')[0]
        fireEvent.click(backButton)

        // Should show confirmation dialog
        expect(confirmSpy).toHaveBeenCalledWith('You have unsaved changes. Are you sure you want to leave?')

        // Should navigate after confirmation
        expect(mockNavigate).toHaveBeenCalledWith({ to: '/internal' })

        confirmSpy.mockRestore()
    })
})
