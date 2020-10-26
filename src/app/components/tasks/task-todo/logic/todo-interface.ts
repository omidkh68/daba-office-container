export interface TodoInterface {
  todoId?: number;
  taskId?: number;
  email?: string;
  isChecked?: number;
  text: string;
  creationDate?: string;
  priority?: string;
}

export interface TodoTaskInterface {
  todoId: number;
  taskId: number;
}
