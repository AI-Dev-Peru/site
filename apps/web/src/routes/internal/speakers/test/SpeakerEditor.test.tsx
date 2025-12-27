// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SpeakerEditor } from '../$speakerId'
import { speakersRepository } from '@/lib/dataSource'
import { FakeSpeakerRepository } from '@/test/doubles/FakeSpeakerRepository'
import { createTestWrapper } from '@/test/client'
import { type Speaker } from '@/features/speakers/types'
import * as router from '@tanstack/react-router'

vi.mock('@tanstack/react-router', () => ({
    useNavigate: vi.fn(),
    createFileRoute: () => () => null // Mock createFileRoute factory
}))

describe('SpeakerEditor Avatar Upload', () => {
    let fakeSpeakersRepo: FakeSpeakerRepository
    const mockSpeaker: Speaker = {
        id: '1',
        name: 'Jane Doe',
        role: 'Engineer',
        company: 'TechCorp',
        email: 'jane@example.com'
    }
    const mockNavigate = vi.fn()

    beforeEach(() => {
        fakeSpeakersRepo = speakersRepository as unknown as FakeSpeakerRepository
        fakeSpeakersRepo.givenSpeakers([mockSpeaker])
        vi.mocked(router.useNavigate).mockReturnValue(mockNavigate)
    })

    it('should render avatar file input', () => {
        render(<SpeakerEditor speaker={mockSpeaker} />, { wrapper: createTestWrapper() })

        const avatarInput = screen.getByLabelText(/avatar/i)
        expect(avatarInput).toBeInTheDocument()
        expect(avatarInput).toHaveAttribute('type', 'file')
        expect(avatarInput).toHaveAttribute('accept', 'image/*')
    })

    it('should update speaker with new avatar', async () => {
        render(<SpeakerEditor speaker={mockSpeaker} />, { wrapper: createTestWrapper() })

        const file = new File(['test'], 'new-avatar.png', { type: 'image/png' })
        const fileInput = screen.getByLabelText(/avatar/i) as HTMLInputElement

        fireEvent.change(fileInput, { target: { files: [file] } })

        const doneBtn = screen.getByText('Done')
        fireEvent.click(doneBtn)

        await waitFor(async () => {
            const speakers = await fakeSpeakersRepo.getSpeakers()
            const updatedSpeaker = speakers.find(s => s.id === '1')
            expect(updatedSpeaker?.avatarUrl).toBeDefined()
            expect(updatedSpeaker?.avatarUrl).toMatch(/^data:image/)
        })
    })

    it('should show current avatar URL when editing', () => {
        const speakerWithAvatar: Speaker = {
            ...mockSpeaker,
            avatarUrl: 'https://example.com/avatar.png'
        }

        render(<SpeakerEditor speaker={speakerWithAvatar} />, { wrapper: createTestWrapper() })

        expect(screen.getByText(/Current:/)).toBeInTheDocument()
        expect(screen.getByText(/https:\/\/example.com\/avatar.png/)).toBeInTheDocument()
    })
})
