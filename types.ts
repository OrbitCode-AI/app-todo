export interface TodoRecord {
  text: string
  completed: boolean
}

export type Todo = TodoRecord & { id: string }

export type TodoFilter = 'all' | 'active' | 'completed'
