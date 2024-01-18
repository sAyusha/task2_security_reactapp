import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { server } from "../mocks/server";
import SignupPage from "./SignupPage";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const customRender = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <UserContext.Provider value={providerProps}>{ui}</UserContext.Provider>,
    renderOptions
  );
};
 
describe("Signup Page", () => {
  let providerProps;

  beforeEach(() => {
    providerProps = {
    };
  });

  test("should render correctly", () => {
    customRender(
      <Router>
        <SignupPage />
      </Router>,
      { providerProps }
    );
  });

  test("should sign up a user when the form is submitted with valid data", async () => {
    customRender(
      <Router>
        <SignupPage />
      </Router>,
      { providerProps }
    );

    // Simulate user input
    fireEvent.change(screen.getByPlaceholderText("Enter your full name"), {
      target: { value: "Test User" },
    });

    fireEvent.change(screen.getByPlaceholderText("Enter your username"), {
      target: { value: "testuser5" },
    });

    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "testuser5@example.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Enter your contact no."), {
      target: { value: "1234567890" },
    });

    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "testpassword" },
    });

    const createAccountButton = screen.getByRole("button", {
      name: /NEXT/i,
    });

    fireEvent.click(createAccountButton);
  });
});