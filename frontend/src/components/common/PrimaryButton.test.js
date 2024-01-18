import { render, screen } from "@testing-library/react";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import PrimaryButton from "./PrimaryButton";

describe("Primary Button", () => {
  test("should display a button", () => {
    render(
      <Router>
        <PrimaryButton />
      </Router>
    );

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  test("should call onClick when clicked", () => {
    const onClick = jest.fn();

    render(
      <Router>
        <PrimaryButton onClick={onClick} />
      </Router>
    );

    const button = screen.getByRole("button");

    button.click();

    expect(onClick).toHaveBeenCalled();
  });
});
