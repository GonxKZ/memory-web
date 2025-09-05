import { createMachine } from 'xstate'

export const coherenceMachine = createMachine({
  id: 'coherence',
  initial: 'idle',
  states: {
    idle: {
      on: {
        CORE_READ: 'reading',
        CORE_WRITE: 'writing'
      }
    },
    reading: {
      on: {
        COMPLETE: 'idle'
      }
    },
    writing: {
      on: {
        COMPLETE: 'idle'
      }
    }
  }
})