import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProjectForm from "../ProjectForm";

describe("ProjectForm", () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it("renders form fields correctly", () => {
    render(<ProjectForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText("Project Title")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
    expect(screen.getByLabelText("Status")).toBeInTheDocument();
    expect(screen.getByText("Save Project")).toBeInTheDocument();
  });

  it("shows validation errors for empty fields", async () => {
    render(<ProjectForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByText("Save Project");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Title is required")).toBeInTheDocument();
      expect(screen.getByText("Description is required")).toBeInTheDocument();
    });
  });

  it("calls onSubmit with form data when form is valid", async () => {
    render(<ProjectForm onSubmit={mockOnSubmit} />);

    fireEvent.change(screen.getByLabelText("Project Title"), {
      target: { value: "Test Project" },
    });
    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "This is a test project description" },
    });

    const submitButton = screen.getByText("Save Project");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: "Test Project",
        description: "This is a test project description",
        status: "active",
      });
    });
  });

  it("shows loading state when submitting", () => {
    render(<ProjectForm onSubmit={mockOnSubmit} isLoading={true} />);

    expect(screen.getByText("Saving...")).toBeInTheDocument();
    expect(screen.getByText("Saving...")).toBeDisabled();
  });
});






