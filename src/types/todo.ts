export type TodoStatus = "TO_DO" | "DOING" | "DONE";

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
