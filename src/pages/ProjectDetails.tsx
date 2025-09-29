import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { projectsAPI, tasksAPI } from "../services/api";
import { Project, Task, CreateTaskData, UpdateTaskData } from "../types";
import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      loadProjectAndTasks();
    }
  }, [id]);

  const loadProjectAndTasks = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      setError("");

      const [projectData, tasksData] = await Promise.all([
        projectsAPI.getById(id),
        tasksAPI.getByProject(id),
      ]);

      setProject(projectData);
      setTasks(tasksData);
    } catch (err: any) {
      setError("Failed to load project details. Please try again.");
      console.error("Error loading project:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = async (data: CreateTaskData) => {
    if (!id) return;

    try {
      setIsCreating(true);
      const newTask = await tasksAPI.create(id, data);
      setTasks([newTask, ...tasks]);
      setShowCreateForm(false);
    } catch (err: any) {
      setError("Failed to create task. Please try again.");
      console.error("Error creating task:", err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateTask = async (
    taskId: string,
    data: { status: "todo" | "in-progress" | "done" }
  ) => {
    try {
      setIsUpdating(taskId);
      const updatedTask = await tasksAPI.update(taskId, data);
      setTasks(tasks.map((task) => (task._id === taskId ? updatedTask : task)));
    } catch (err: any) {
      setError("Failed to update task. Please try again.");
      console.error("Error updating task:", err);
    } finally {
      setIsUpdating(null);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this task? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setIsDeleting(taskId);
      await tasksAPI.delete(taskId);
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (err: any) {
      setError("Failed to delete task. Please try again.");
      console.error("Error deleting task:", err);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleStatusFilter = async (status: string) => {
    if (!id) return;

    setStatusFilter(status);
    try {
      const filteredTasks = await tasksAPI.getByProject(
        id,
        status || undefined
      );
      setTasks(filteredTasks);
    } catch (err: any) {
      setError("Failed to filter tasks. Please try again.");
      console.error("Error filtering tasks:", err);
    }
  };

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.status === status);
  };

  const getStatusCount = (status: string) => {
    return tasks.filter((task) => task.status === status).length;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Project not found
        </h2>
        <Link
          to="/dashboard"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <Link
            to="/dashboard"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-2 inline-block"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
          <p className="text-gray-600 mt-2">{project.description}</p>
          <div className="flex items-center space-x-4 mt-4">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                project.status === "active"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {project.status}
            </span>
            <span className="text-sm text-gray-500">
              Created: {new Date(project.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          Add Task
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Task Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-medium">
                  {getStatusCount("todo")}
                </span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">To Do</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 font-medium">
                  {getStatusCount("in-progress")}
                </span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">In Progress</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-medium">
                  {getStatusCount("done")}
                </span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Done</p>
            </div>
          </div>
        </div>
      </div>

      {/* Task Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleStatusFilter("")}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              !statusFilter
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All Tasks ({tasks.length})
          </button>
          <button
            onClick={() => handleStatusFilter("todo")}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              statusFilter === "todo"
                ? "bg-gray-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            To Do ({getStatusCount("todo")})
          </button>
          <button
            onClick={() => handleStatusFilter("in-progress")}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              statusFilter === "in-progress"
                ? "bg-yellow-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            In Progress ({getStatusCount("in-progress")})
          </button>
          <button
            onClick={() => handleStatusFilter("done")}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              statusFilter === "done"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Done ({getStatusCount("done")})
          </button>
        </div>
      </div>

      {/* Create Task Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Create New Task</h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <TaskForm onSubmit={handleCreateTask} isLoading={isCreating} />
          </div>
        </div>
      )}

      {/* Tasks */}
      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📝</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No tasks found
          </h3>
          <p className="text-gray-600 mb-4">
            {statusFilter
              ? "No tasks match the current filter."
              : "Get started by creating your first task for this project."}
          </p>
          {!statusFilter && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
            >
              Create Task
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onUpdate={handleUpdateTask}
              onDelete={handleDeleteTask}
              isUpdating={isUpdating === task._id}
              isDeleting={isDeleting === task._id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
