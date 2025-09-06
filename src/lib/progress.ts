export type LessonSlug = string

const VISITED_KEY = 'progress:visitedLessons'
const LAST_KEY = 'lesson:lastVisited'

function readVisited(): Set<LessonSlug> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = window.localStorage.getItem(VISITED_KEY)
    return new Set(raw ? (JSON.parse(raw) as LessonSlug[]) : [])
  } catch {
    return new Set()
  }
}

function writeVisited(v: Set<LessonSlug>) {
  if (typeof window === 'undefined') return
  try { window.localStorage.setItem(VISITED_KEY, JSON.stringify(Array.from(v))) } catch {}
}

export function markVisited(slug: LessonSlug) {
  const s = readVisited()
  if (!s.has(slug)) { s.add(slug); writeVisited(s) }
  setLastVisited(slug)
}

export function isVisited(slug: LessonSlug): boolean { return readVisited().has(slug) }
export function getVisited(): LessonSlug[] { return Array.from(readVisited()) }

export function clearVisited() { writeVisited(new Set()) }

export function getLastVisited(): LessonSlug | null {
  if (typeof window === 'undefined') return null
  try { return window.localStorage.getItem(LAST_KEY) } catch { return null }
}

export function setLastVisited(slug: LessonSlug) {
  if (typeof window === 'undefined') return
  try { window.localStorage.setItem(LAST_KEY, slug) } catch {}
}

