import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { axe, toHaveNoViolations } from 'jest-axe'
import React from 'react'
import LessonsPage from '@/app/lessons/page'

expect.extend(toHaveNoViolations)

describe('A11y: LessonsPage', () => {
  it('has no obvious accessibility violations', async () => {
    const { container } = render(<MemoryRouter>
      <LessonsPage />
    </MemoryRouter>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
