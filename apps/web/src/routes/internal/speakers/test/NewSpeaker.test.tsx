// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { NewSpeaker } from '../$speakerId'
import { speakersRepository } from '@/lib/dataSource'
import { FakeSpeakerRepository } from '@/test/doubles/FakeSpeakerRepository'
import { createTestWrapper } from '@/test/client'
import * as router from '@tanstack/react-router'

vi.mock('@tanstack/react-router', () => ({
  useNavigate: vi.fn(),
  createFileRoute: () => () => null // Mock createFileRoute factory
}))

describe('NewSpeaker Avatar Upload', () => {
  let fakeSpeakersRepo: FakeSpeakerRepository
  const mockNavigate = vi.fn()

  beforeEach(() => {
    fakeSpeakersRepo = speakersRepository as unknown as FakeSpeakerRepository
    fakeSpeakersRepo.givenSpeakers([])
    vi.mocked(router.useNavigate).mockReturnValue(mockNavigate)
  })

  it('should render avatar file input', () => {
    render(<NewSpeaker />, { wrapper: createTestWrapper() })

    const avatarInput = screen.getByLabelText(/avatar/i)
    expect(avatarInput).toBeInTheDocument()
    expect(avatarInput).toHaveAttribute('type', 'file')
    expect(avatarInput).toHaveAttribute('accept', 'image/*')
  })

  it('should create speaker with avatar and store as base64', async () => {
    render(<NewSpeaker />, { wrapper: createTestWrapper() })

    const file = new File(['test'], 'avatar.png', { type: 'image/png' })
    const fileInput = screen.getByLabelText(/avatar/i) as HTMLInputElement

    fireEvent.change(fileInput, { target: { files: [file] } })

    const nameInput = screen.getByPlaceholderText('Enter speaker name')
    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } })

    const submitBtn = screen.getByText('Create Speaker')
    fireEvent.click(submitBtn)

    await waitFor(async () => {
      const speakers = await fakeSpeakersRepo.getSpeakers()
      expect(speakers).toHaveLength(1)
      expect(speakers[0].name).toBe('Jane Doe')
      expect(speakers[0].avatarUrl).toBeDefined()
      expect(speakers[0].avatarUrl).toMatch(/^data:image/)
    })
  })

  it('should create speaker without avatar', async () => {
    render(<NewSpeaker />, { wrapper: createTestWrapper() })

    const nameInput = screen.getByPlaceholderText('Enter speaker name')
    fireEvent.change(nameInput, { target: { value: 'John Doe' } })

    const submitBtn = screen.getByText('Create Speaker')
    fireEvent.click(submitBtn)

    await waitFor(async () => {
      const speakers = await fakeSpeakersRepo.getSpeakers()
      expect(speakers).toHaveLength(1)
      expect(speakers[0].name).toBe('John Doe')
      expect(speakers[0].avatarUrl).toBeUndefined()
    })
  })
})
