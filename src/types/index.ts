export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  status: "active" | "completed";
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  dueDate?: string;
  project: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectsResponse {
  projects: Project[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateProjectData {
  title: string;
  description: string;
  status?: "active" | "completed";
}

export interface UpdateProjectData extends Partial<CreateProjectData> {}

export interface CreateTaskData {
  title: string;
  description: string;
  status?: "todo" | "in-progress" | "done";
  dueDate?: string;
}

export interface UpdateTaskData extends Partial<CreateTaskData> {}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}




