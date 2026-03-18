export interface TodoRecord {
  text: string
  completed: boolean
}

export type Todo = TodoRecord

export type TodoFilter = 'all' | 'active' | 'completed'
