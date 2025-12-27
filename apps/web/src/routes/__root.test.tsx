import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RootComponent } from './__root'

vi.mock('@vercel/analytics/react', () => ({
    Analytics: () => <div data-testid="analytics" />,
}))

vi.mock('@tanstack/react-router', () => ({
    createRootRoute: vi.fn((options) => options),
    Outlet: () => <div data-testid="outlet" />,
}))

describe('RootComponent', () => {
    it('renders the Analytics component', () => {
        render(<RootComponent />)
        expect(screen.getByTestId('analytics')).toBeInTheDocument()
    })

    it('renders the Outlet component', () => {
        render(<RootComponent />)
        expect(screen.getByTestId('outlet')).toBeInTheDocument()
    })
})
