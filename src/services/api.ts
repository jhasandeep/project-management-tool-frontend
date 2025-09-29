import axios from "axios";
import {
  AuthResponse,
  CreateProjectData,
  UpdateProjectData,
  ProjectsResponse,
  CreateTaskData,
  UpdateTaskData,
  Project,
  Task,
} from "../types";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  register: async (
    name: string,
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    const response = await api.post("/auth/register", {
      name,
      email,
      password,
    });
    return response.data;
  },
};

// Projects API
export const projectsAPI = {
  getAll: async (
    page = 1,
    limit = 10,
    search?: string,
    status?: string
  ): Promise<ProjectsResponse> => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (search) params.append("search", search);
    if (status) params.append("status", status);

    const url = `/projects?${params.toString()}`;
    const response = await api.get(url);
    return response.data;
  },

  getById: async (id: string): Promise<Project> => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  create: async (data: CreateProjectData): Promise<Project> => {
    const response = await api.post("/projects", data);
    return response.data;
  },

  update: async (id: string, data: UpdateProjectData): Promise<Project> => {
    const response = await api.patch(`/projects/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/projects/${id}`);
  },
};

// Tasks API
export const tasksAPI = {
  getByProject: async (projectId: string, status?: string): Promise<Task[]> => {
    const params = new URLSearchParams();
    if (status) params.append("status", status);

    const response = await api.get(
      `/projects/${projectId}/tasks?${params.toString()}`
    );
    return response.data;
  },

  getById: async (id: string): Promise<Task> => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  create: async (projectId: string, data: CreateTaskData): Promise<Task> => {
    const response = await api.post(`/projects/${projectId}/tasks`, data);
    return response.data;
  },

  update: async (id: string, data: UpdateTaskData): Promise<Task> => {
    const response = await api.patch(`/tasks/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },
};

export default api;
