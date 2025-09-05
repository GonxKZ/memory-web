import Dexie from 'dexie'

class ProgressDB extends Dexie {
  lessons: Dexie.Table<LessonProgress, string>
  labs: Dexie.Table<LabProgress, string>

  constructor() {
    super('memoria-lowlevel')
    this.version(1).stores({
      lessons: 'id, completed, lastAccessed',
      labs: 'id, completed, attempts, bestScore'
    })
    
    this.lessons = this.table('lessons')
    this.labs = this.table('labs')
  }
}

export interface LessonProgress {
  id: string
  completed: boolean
  lastAccessed: Date
}

export interface LabProgress {
  id: string
  completed: boolean
  attempts: number
  bestScore: number
}

export const db = new ProgressDB()