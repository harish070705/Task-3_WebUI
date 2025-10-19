export interface TaskExecution {
  startTime: string; 
  endTime: string;   
  output: string;
}
export interface Task {
  id: string;
  name: string;
  owner: string;
  command: string;
  status: string | null;
  taskExecutions: TaskExecution[];
}

export type NewTask = Omit<Task, 'id' | 'taskExecutions'>;