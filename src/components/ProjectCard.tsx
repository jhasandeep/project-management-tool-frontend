import React from "react";
import { Link } from "react-router-dom";
import { Project } from "../types";

interface ProjectCardProps {
  project: Project;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onDelete,
  isDeleting = false,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {project.title}
          </h3>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
              project.status
            )}`}
          >
            {project.status}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {project.description}
        </p>

        <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
          <span>Created: {formatDate(project.createdAt)}</span>
          <span>Updated: {formatDate(project.updatedAt)}</span>
        </div>

        <div className="flex space-x-3">
          <Link
            to={`/projects/${project._id}`}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-md text-sm font-medium transition-colors"
          >
            View Details
          </Link>
          <button
            onClick={() => onDelete(project._id)}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;






