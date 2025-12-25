// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CreateSpeakerModal } from './CreateSpeakerModal'
import * as hooks from '../../features/speakers/hooks'

// Mock dataSource to prevent top-level side effects
vi.mock('../../lib/dataSource', () => ({
    getAuthRepository: vi.fn(),
    getSpeakerRepository: vi.fn()
}))

// Mock the hooks
vi.mock('../../features/speakers/hooks', () => ({
    useCreateSpeaker: vi.fn()
}))

describe('CreateSpeakerModal', () => {
    const mockMutateAsync = vi.fn()
    const mockOnClose = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()
        // Setup default mock return value
        vi.mocked(hooks.useCreateSpeaker).mockReturnValue({
            mutateAsync: mockMutateAsync,
            isPending: false,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any)
    })

    it('should submit form with only required name', async () => {
        render(<CreateSpeakerModal isOpen={true} onClose={mockOnClose} />)

        // Fill in required name
        const nameInput = screen.getByPlaceholderText('Enter speaker name')
        fireEvent.change(nameInput, { target: { value: 'John Doe' } })

        // No Role filled (testing optionality)

        // Submit
        const submitButton = screen.getByText('Create Speaker')
        fireEvent.click(submitButton)

        // Verify mutation called with expect options
        await waitFor(() => {
            expect(mockMutateAsync).toHaveBeenCalledWith({
                name: 'John Doe',
                role: '',
                company: '',
                email: ''
            })
        })

        // Verify modal closed
        expect(mockOnClose).toHaveBeenCalled()
    })

    it('should show "Role" as optional (no *)', () => {
        render(<CreateSpeakerModal isOpen={true} onClose={mockOnClose} />)

        // Find label by text. If it had *, this would fail or need regex
        const roleLabel = screen.getByText('Role')
        expect(roleLabel).toBeInTheDocument()
        expect(roleLabel.textContent).not.toContain('*')
    })
})
