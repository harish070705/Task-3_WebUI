import axios from 'axios';
import { Task, TaskExecution, NewTask } from '../types';

const API_BASE = '/api/tasks';

// GET 
export const getTasks = async (): Promise<Task[]> => {
  const response = await axios.get<Task[]>(API_BASE);
  return response.data;
};

// GET /search?name={name}
export const searchTasks = async (name: string): Promise<Task[]> => {
  const response = await axios.get<Task[]>(`${API_BASE}/search`, { params: { name } });
  return response.data;
};

// PUT
export const saveTask = async (task: Task | NewTask): Promise<Task> => {
  const response = await axios.put<Task>(API_BASE, task);
  return response.data;
};

// DELETE
export const deleteTask = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE}/${id}`);
};

// PUT /{id}/run
export const runTask = async (id: string): Promise<TaskExecution> => {
  const response = await axios.put<TaskExecution>(`${API_BASE}/${id}/run`);
  return response.data;
};