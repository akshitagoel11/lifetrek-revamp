export interface Skill {
  id: string
  name: string
  level: number
  history: { date: string; level: number }[]
}

export interface Task {
  id: string
  text: string
  completed: boolean
  createdDate: string
  completedDate?: string
}

export interface Resource {
  id: string
  name: string
  url: string
  type: "file" | "link"
  fileType?: string
  createdDate: string
}

export interface Deadline {
  id: string
  text: string
  date: string
  completed: boolean
}

export interface Voucher {
  id: string
  code: string
  date: string
  used: boolean
}

export interface Transaction {
  id: string
  amount: number
  type: "income" | "expense"
  category: string
  description: string
  date: string
}
