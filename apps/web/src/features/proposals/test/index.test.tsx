// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Route } from '@/routes/internal/proposals/index'
import { type TalkProposal } from '@/lib/repositories/ProposalRepository'
import { proposalsRepository } from '@/lib/dataSource'
import { FakeProposalRepository } from '@/test/doubles/FakeProposalRepository'
import { createTestWrapper } from '@/test/client'

// Mock Dialog to avoid complex interactions in list test
vi.mock('../components/AcceptProposalDialog', () => ({
    AcceptProposalDialog: ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => (
        open ? <div data-testid="mock-dialog">
            <button onClick={() => onOpenChange(false)}>Close</button>
        </div> : null
    )
}))

// Get the component from the route
const ProposalList = Route.options.component as React.ComponentType

const getMockProposals = (): TalkProposal[] => [
    {
        id: '1',
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '123',
        title: 'Draft Talk',
        description: 'Desc',
        duration: '30',
        status: 'proposed',
        createdAt: '2024-01-01T00:00:00Z'
    },
    {
        id: '2',
        fullName: 'Jane Smith',
        email: 'jane@example.com',
        phone: '456',
        title: 'Accepted Talk',
        description: 'Desc 2',
        duration: '15',
        status: 'accepted',
        createdAt: '2024-01-02T00:00:00Z'
    }
]

describe('ProposalList', () => {
    let fakeProposalsRepo: FakeProposalRepository

    beforeEach(() => {
        vi.clearAllMocks()
        fakeProposalsRepo = proposalsRepository as unknown as FakeProposalRepository
        fakeProposalsRepo.givenProposals(getMockProposals())

        // Mock confirm
        window.confirm = vi.fn(() => true)
    })

    it('should filter by proposed by default', async () => {
        render(<ProposalList />, { wrapper: createTestWrapper() })

        await waitFor(() => {
            expect(screen.getByText('Draft Talk')).toBeInTheDocument()
        })
        expect(screen.queryByText('Accepted Talk')).not.toBeInTheDocument()
    })

    it('should switch filters', async () => {
        render(<ProposalList />, { wrapper: createTestWrapper() })

        // Wait for initial load
        await waitFor(() => {
            expect(screen.getByText('Draft Talk')).toBeInTheDocument()
        })

        // Click Accepted filter
        const acceptedBtn = screen.getByText('Accepted')
        fireEvent.click(acceptedBtn)

        await waitFor(() => {
            expect(screen.getByText('Accepted Talk')).toBeInTheDocument()
        })
        expect(screen.queryByText('Draft Talk')).not.toBeInTheDocument()
    })

    it('should reject proposal', async () => {
        render(<ProposalList />, { wrapper: createTestWrapper() })

        await waitFor(() => {
            // Use exact match for Reject action button
            expect(screen.getByRole('button', { name: 'Reject' })).toBeInTheDocument()
        })

        const rejectBtn = screen.getByRole('button', { name: 'Reject' })
        fireEvent.click(rejectBtn)

        expect(window.confirm).toHaveBeenCalled()

        await waitFor(async () => {
            const proposals = await fakeProposalsRepo.getProposals()
            const rejectedProposal = proposals.find(p => p.id === '1')
            expect(rejectedProposal?.status).toBe('rejected')
        })
    })

    it('should open accept dialog', async () => {
        render(<ProposalList />, { wrapper: createTestWrapper() })

        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'Accept' })).toBeInTheDocument()
        })

        const acceptBtn = screen.getByRole('button', { name: 'Accept' })
        fireEvent.click(acceptBtn)

        expect(screen.getByTestId('mock-dialog')).toBeInTheDocument()
    })
})
