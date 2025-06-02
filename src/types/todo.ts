export type TodoStatus = "todo" | "doing" | "done";

export interface Todo {
  _id: string;
  title: string;
  description?: string;
  status: TodoStatus;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  deadline: string;
  labels: Label[];
}

export interface Label {
  _id?: string;
  name: string;
  color: string;
}

export interface TodoColumn {
  id: TodoStatus;
  title: string;
  todos: Todo[];
}
