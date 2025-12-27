// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AcceptProposalDialog } from '../components/AcceptProposalDialog'
import { type TalkProposal } from '@/lib/repositories/ProposalRepository'
import { eventsRepository, speakersRepository, proposalsRepository } from '@/lib/dataSource'
import { FakeEventRepository } from '@/test/doubles/FakeEventRepository'
import { FakeSpeakerRepository } from '@/test/doubles/FakeSpeakerRepository'
import { FakeProposalRepository } from '@/test/doubles/FakeProposalRepository'
import { createTestWrapper } from '@/test/client'

const mockProposal: TalkProposal = {
    id: 'prop-1',
    fullName: 'Jane Doe',
    email: 'jane@example.com',
    phone: '123456789',
    title: 'Awesome Talk',
    description: 'This is an awesome talk.',
    duration: '30',
    status: 'proposed',
    createdAt: new Date().toISOString()
}


describe('AcceptProposalDialog', () => {
    const mockOnOpenChange = vi.fn()
    let fakeEventsRepo: FakeEventRepository
    let fakeSpeakersRepo: FakeSpeakerRepository
    let fakeProposalsRepo: FakeProposalRepository

    beforeEach(() => {
        vi.clearAllMocks()

        fakeEventsRepo = eventsRepository as FakeEventRepository
        fakeSpeakersRepo = speakersRepository as FakeSpeakerRepository
        fakeProposalsRepo = proposalsRepository as FakeProposalRepository

        // Reset data
        fakeEventsRepo.givenEvents([])
        fakeSpeakersRepo.givenSpeakers([])
        fakeProposalsRepo.givenProposals([mockProposal])
    })

    it('should detect existing speaker by email', async () => {
        const existingSpeaker = { id: 'spk-1', name: 'Jane Doe', email: 'jane@example.com', role: 'Speaker', company: '' }
        fakeSpeakersRepo.givenSpeakers([existingSpeaker])

        render(<AcceptProposalDialog proposal={mockProposal} open={true} onOpenChange={mockOnOpenChange} />, {
            wrapper: createTestWrapper()
        })

        // Wait for query to resolve
        await waitFor(() => {
            const existingRadio = screen.getByLabelText('Link to existing speaker') as HTMLInputElement
            expect(existingRadio.checked).toBe(true)
        })

        expect(screen.getByDisplayValue(/Jane Doe/)).toBeInTheDocument()
    })

    it('should default to new speaker if not found', async () => {
        fakeSpeakersRepo.givenSpeakers([])

        render(<AcceptProposalDialog proposal={mockProposal} open={true} onOpenChange={mockOnOpenChange} />, {
            wrapper: createTestWrapper()
        })

        await waitFor(() => {
            const newRadio = screen.getByLabelText(/Create new speaker/i) as HTMLInputElement
            expect(newRadio.checked).toBe(true)
        })
    })

    it('should create new event and new speaker then accept', async () => {
        fakeEventsRepo.givenEvents([])
        fakeSpeakersRepo.givenSpeakers([])

        render(<AcceptProposalDialog proposal={mockProposal} open={true} onOpenChange={mockOnOpenChange} />, {
            wrapper: createTestWrapper()
        })

        // Fill new event form
        fireEvent.change(screen.getByPlaceholderText('Event Title'), { target: { value: 'New Event' } })

        // Click Confirm
        fireEvent.click(screen.getByText('Confirm & Accept'))

        await waitFor(async () => {
            // Check Speaker Created
            const speakers = await fakeSpeakersRepo.getSpeakers()
            expect(speakers).toHaveLength(1)
            expect(speakers[0].email).toBe('jane@example.com')

            // Check Event Created
            const events = await fakeEventsRepo.getEvents()
            expect(events).toHaveLength(1)
            expect(events[0].title).toBe('New Event')

            // Check Agenda
            expect(events[0].agenda).toHaveLength(1)
            expect(events[0].agenda[0].title).toBe('Awesome Talk')
            expect(events[0].agenda[0].speakerId).toBe(speakers[0].id)

            // Check Proposal Status
            const proposals = await fakeProposalsRepo.getProposals()
            expect(proposals[0].status).toBe('accepted')

            expect(mockOnOpenChange).toHaveBeenCalledWith(false)
        })
    })

    it('should link to existing event and existing speaker', async () => {
        const existingEvent = {
            id: 'evt-1',
            title: 'Existing Event',
            agenda: [],
            date: '2024-01-01',
            time: '10:00',
            format: 'in-person' as const,
            description: '',
            location: '',
            status: 'published' as const,
            links: [
                { type: 'related', url: 'https://example.com' }
            ]
        }
        const existingSpeaker = { id: 'spk-1', name: 'Jane Doe', email: 'jane@example.com', role: 'Speaker', company: '' }

        fakeEventsRepo.givenEvents([existingEvent])
        fakeSpeakersRepo.givenSpeakers([existingSpeaker])

        render(<AcceptProposalDialog proposal={mockProposal} open={true} onOpenChange={mockOnOpenChange} />, {
            wrapper: createTestWrapper()
        })

        await waitFor(() => {
            // Wait for data load and auto-selection
            const existingRadio = screen.getByLabelText('Link to existing speaker') as HTMLInputElement
            expect(existingRadio.checked).toBe(true)
        })

        // Select existing event
        const eventSelect = screen.getByLabelText('Select Event')
        fireEvent.change(eventSelect, { target: { value: 'evt-1' } })

        // Click Confirm
        fireEvent.click(screen.getByText('Confirm & Accept'))

        await waitFor(async () => {
            // Check Event Updated
            const events = await fakeEventsRepo.getEvents()
            expect(events[0].agenda).toHaveLength(1)
            expect(events[0].agenda[0].speakerId).toBe('spk-1')

            // Check Proposal Status
            const proposals = await fakeProposalsRepo.getProposals()
            expect(proposals[0].status).toBe('accepted')

            // Ensure no new speakers/events created
            const speakers = await fakeSpeakersRepo.getSpeakers()
            expect(speakers).toHaveLength(1)
            expect(events).toHaveLength(1)
        })
    })
})
