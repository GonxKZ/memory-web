import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import React from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import LessonRoute from '@/app/lesson/route'

expect.extend(toHaveNoViolations)

describe('A11y: LessonRoute', () => {
  it('has no obvious accessibility violations on unknown route', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/lesson/unknown/slug"]}>
        <Routes>
          <Route path="/lesson/*" element={<LessonRoute />} />
        </Routes>
      </MemoryRouter>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

