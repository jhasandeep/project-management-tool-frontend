import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

// Mock the router to avoid issues with routing in tests
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  BrowserRouter: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe("App", () => {
  it("renders without crashing", () => {
    render(<App />);
    expect(screen).toBeTruthy();
  });
});




