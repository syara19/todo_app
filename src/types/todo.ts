export interface Todo {
  id: string;
  title: string;
  description?: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  isDone: boolean;
  dueDate?: string;
  label?: { title: string };
}
