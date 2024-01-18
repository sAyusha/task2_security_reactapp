import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import ChangePassword from "./ChangePasswordPage";

jest.mock("axios");

describe("Change Password", () => {
  it("should successfully change password", async () => {
    const mockResponse = { status: 204 };
    axios.put.mockResolvedValue(mockResponse);

    render(
      <Router>
        <ChangePassword />
      </Router>
    );

    // Mock user input
    const currentPasswordInput = screen.getByLabelText("Current Password");
    const newPasswordInput = screen.getByLabelText("New Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm New Password");

    fireEvent.change(currentPasswordInput, {
      target: { value: "oldPassword" },
    });
    fireEvent.change(newPasswordInput, { target: { value: "newPassword" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "newPassword" },
    });

    // Mock submit action
    const changePasswordButton = screen.getByText("CHANGE PASSWORD");
    fireEvent.click(changePasswordButton);

    // Check for success message
    const successMessage = await screen.findByText(
      "Password changed successfully!"
    );
    expect(successMessage).toBeInTheDocument();
  });
});