import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import React from 'react'
import LessonRoute from './route'

describe('LessonRoute', () => {
  it('shows not found and back button for unknown lesson', () => {
    render(
      <MemoryRouter initialEntries={["/lesson/unknown/path"]}>
        <Routes>
          <Route path="/lesson/*" element={<LessonRoute />} />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByText(/no se encontró la lección/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /volver a lecciones/i })).toBeInTheDocument()
  })
})

