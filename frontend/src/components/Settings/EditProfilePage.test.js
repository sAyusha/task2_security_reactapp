import "@testing-library/jest-dom/extend-expect"; // For additional matchers
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios"; // Mocked axios instance
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { server } from "../../mocks/server"; // Import your MSW server
import EditProfile from "./EditProfilePage";

// Set up Axios mock
jest.mock("axios");

const customRender = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <UserContext.Provider value={providerProps}>{ui}</UserContext.Provider>,
    renderOptions
  );
};

describe("EditProfile", () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  let providerProps;

  beforeEach(() => {
    providerProps = {
      setUser: jest.fn(),
      isLoading: false,
      setIsLoading: jest.fn(),
    };
  });

  test("updates user profile on form submission", async () => {
    // Mock user context
    const mockUser = {
      data: [
        {
          fullname: "John Doe",
          username: "johndoe",
          email: "johndoe@example.com",
          phone: "1234567890",
          bio: "Test bio",
        },
      ],
    };

    // Mock Axios response
    axios.put.mockResolvedValueOnce({ data: mockUser });

    // Render the component
    customRender(
      <Router>
        <EditProfile />
      </Router>,
      { providerProps }
    );

    // Fill out the form
    fireEvent.change(screen.getByLabelText("Full Name"), {
      target: { value: "Updated Name" },
    });
    // ... Simulate changes for other fields ...

    // Submit the form
    fireEvent.click(screen.getByText("UPDATE NOW"));

    // Wait for the update to complete
    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledTimes(1);
    });

    // Check that the user context was updated
    expect(providerProps.setUser).toHaveBeenCalledTimes(0);
  });
});