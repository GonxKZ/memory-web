import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import ErrorBoundary from './ErrorBoundary'

function Boom() {
  throw new Error('boom')
}

describe('ErrorBoundary', () => {
  it('shows fallback when child throws', () => {
    render(
      <ErrorBoundary>
        {/* @ts-expect-error intentional throw for test */}
        <Boom />
      </ErrorBoundary>
    )
    expect(screen.getByText(/ha ocurrido un error/i)).toBeInTheDocument()
  })
})

