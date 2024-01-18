// pages/SigninPage.test.js
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom"; // Import BrowserRouter
import { UserContext } from "../context/UserContext";
import { server } from "../mocks/server";
import LoginPage from "./LoginPage";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const customRender = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <UserContext.Provider value={providerProps}>{ui}</UserContext.Provider>,
    renderOptions
  );
};

describe("Login Page", () => {
  let providerProps;
  beforeEach(() => {
    providerProps = {
      user: null,
      setUser: jest.fn(),
    };
  });

  test("should render correctly", () => {
    customRender(
      <Router>
        <LoginPage />
      </Router>,
      { providerProps }
    );
  });

  test("should display at least one 'Log In' text", () => {
    customRender(
      <Router>
        <LoginPage />
      </Router>,
      { providerProps }
    );

    const signInTextElements = screen.getAllByText("LOGIN");
    expect(signInTextElements.length).toBeGreaterThan(0);
  });

  test("should display input fields for username and password", () => {
    customRender(
      <Router>
        <LoginPage />
      </Router>,
      { providerProps }
    );

    const usernameInput = screen.getByPlaceholderText(/Enter your username/i);
    const passwordInput = screen.getByPlaceholderText(/Enter your password/i);

    expect(usernameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
  });

  test("should show error message for empty username and password", () => {
    customRender(
      <Router>
        <LoginPage />
      </Router>,
      { providerProps }
    );

    const signInButton = screen.getByRole("button", { name: /LOGIN/i });

    fireEvent.click(signInButton);

    const usernameError = screen.getByText("Username is required");

    expect(usernameError).toBeInTheDocument();
  });

  test("should log in a user when the form is submitted", async () => {
    customRender(
      <Router>
        <LoginPage />
      </Router>,
      { providerProps }
    );

    // Simulate user input
    fireEvent.change(screen.getByPlaceholderText("Enter your username"), {
      target: { value: "testuser" },
    });

    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "testpassword" },
    });

    const signInButton = screen.getByRole("button", { name: /LOGIN/i });

    fireEvent.click(signInButton);

    // Wait for the API call to complete=
    await waitFor(() => {
      expect(window.location.href).toBe("http://localhost/");
    });
  });
});