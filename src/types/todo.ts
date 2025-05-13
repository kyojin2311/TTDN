export type TodoStatus = "DOING" | "DEMO" | "WAITING_REVIEW" | "NEED_FIXED";

export interface Todo {
  id: string;
  title: string;
  description?: string;
  status: TodoStatus;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface TodoColumn {
  id: TodoStatus;
  title: string;
  todos: Todo[];
}
