import React from "react";
import { Task } from "../types";

interface TaskCardProps {
  task: Task;
  onUpdate: (
    id: string,
    data: { status: "todo" | "in-progress" | "done" }
  ) => void;
  onDelete: (id: string) => void;
  isUpdating?: boolean;
  isDeleting?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onUpdate,
  onDelete,
  isUpdating = false,
  isDeleting = false,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo":
        return "bg-gray-100 text-gray-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      case "done":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "done";

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate(task._id, {
      status: e.target.value as "todo" | "in-progress" | "done",
    });
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow ${
        isOverdue ? "border-red-200" : ""
      }`}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h4 className="text-md font-medium text-gray-900 line-clamp-2">
            {task.title}
          </h4>
          <div className="flex items-center space-x-2">
            <select
              value={task.status}
              onChange={handleStatusChange}
              disabled={isUpdating}
              className={`text-xs font-medium px-2 py-1 rounded-full border-0 focus:ring-2 focus:ring-blue-500 ${getStatusColor(
                task.status
              )}`}
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
          {task.description}
        </p>

        {task.dueDate && (
          <div className="flex items-center mb-3">
            <span
              className={`text-xs font-medium ${
                isOverdue ? "text-red-600" : "text-gray-500"
              }`}
            >
              Due: {formatDate(task.dueDate)}
              {isOverdue && " (Overdue)"}
            </span>
          </div>
        )}

        <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
          <span>Created: {formatDate(task.createdAt)}</span>
          <span>Updated: {formatDate(task.updatedAt)}</span>
        </div>

        <button
          onClick={() => onDelete(task._id)}
          disabled={isDeleting}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDeleting ? "Deleting..." : "Delete Task"}
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
