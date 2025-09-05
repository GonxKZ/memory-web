import { createMachine } from 'xstate'

export const consistencyMachine = createMachine({
  id: 'consistency',
  initial: 'idle',
  states: {
    idle: {
      on: {
        STORE: 'storing',
        LOAD: 'loading'
      }
    },
    storing: {
      on: {
        COMPLETE: 'idle'
      }
    },
    loading: {
      on: {
        COMPLETE: 'idle'
      }
    }
  }
})