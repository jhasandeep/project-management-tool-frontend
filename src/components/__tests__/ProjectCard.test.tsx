import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProjectCard from "../ProjectCard";
import { Project } from "../../types";

const mockProject: Project = {
  _id: "1",
  title: "Test Project",
  description: "This is a test project description",
  status: "active",
  owner: "user1",
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
};

describe("ProjectCard", () => {
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    mockOnDelete.mockClear();
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<MemoryRouter>{component}</MemoryRouter>);
  };

  it("renders project information correctly", () => {
    renderWithRouter(
      <ProjectCard project={mockProject} onDelete={mockOnDelete} />
    );

    expect(screen.getByText("Test Project")).toBeInTheDocument();
    expect(
      screen.getByText("This is a test project description")
    ).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("calls onDelete when delete button is clicked", () => {
    renderWithRouter(
      <ProjectCard project={mockProject} onDelete={mockOnDelete} />
    );

    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith("1");
  });

  it("shows loading state when deleting", () => {
    renderWithRouter(
      <ProjectCard
        project={mockProject}
        onDelete={mockOnDelete}
        isDeleting={true}
      />
    );

    expect(screen.getByText("Deleting...")).toBeInTheDocument();
  });

  it("renders completed status correctly", () => {
    const completedProject = { ...mockProject, status: "completed" as const };
    renderWithRouter(
      <ProjectCard project={completedProject} onDelete={mockOnDelete} />
    );

    expect(screen.getByText("Completed")).toBeInTheDocument();
  });
});
