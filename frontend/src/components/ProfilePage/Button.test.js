import { render, screen } from "@testing-library/react";
import React from "react";
import Button from "./Button";

describe("Button Test", () => {
  test("Should Display Button Text and Handle Click", () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick} btnName="Click Me"></Button>);
    expect(screen.getByText("Click Me")).toBeInTheDocument();
  });
});