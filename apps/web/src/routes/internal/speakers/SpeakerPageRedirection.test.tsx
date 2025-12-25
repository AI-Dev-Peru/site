// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { NewSpeaker } from './$speakerId'
import * as hooks from '../../../features/speakers/hooks'
import * as router from '@tanstack/react-router'

// Mock the hooks
vi.mock('../../../features/speakers/hooks', () => ({
    useCreateSpeaker: vi.fn()
}))

vi.mock('@tanstack/react-router', () => ({
    useNavigate: vi.fn(),
    createFileRoute: () => () => null // Mock createFileRoute factory
}))

describe('NewSpeaker Redirection', () => {
    const mockMutateAsync = vi.fn()
    const mockNavigate = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(hooks.useCreateSpeaker).mockReturnValue({
            mutateAsync: mockMutateAsync,
            isPending: false,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any)
        vi.mocked(router.useNavigate).mockReturnValue(mockNavigate)
    })

    it('should redirect to list page after creation', async () => {
        render(<NewSpeaker />)

        // Fill Name
        fireEvent.change(screen.getByPlaceholderText('Enter speaker name'), {
            target: { value: 'Jane Doe' }
        })

        // Submit
        fireEvent.click(screen.getByText('Create Speaker'))

        // Verify redirect
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith({ to: '/internal/speakers' })
        })
    })
})
