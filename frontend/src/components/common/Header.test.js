import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import Header from "./Header";

const customRender = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <UserContext.Provider value={providerProps}>{ui}</UserContext.Provider>,
    renderOptions
  );
};

describe("Header", () => {
  let providerProps;

  beforeEach(() => {
    providerProps = {
      setUser: jest.fn(),
      isLoading: false,
      setIsLoading: jest.fn(),
    };
  });

  test("should display a header", () => {
    customRender(
      <Router>
        <Header />
      </Router>,
      { providerProps }
    );

    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  test("should change theme when theme buttons are clicked", () => {
    customRender(
      <Router>
        <Header />
      </Router>,
      { providerProps }
    );
  
    const sunButton = screen.getByTestId("theme-sun-button");
    const moonButton = screen.getByTestId("theme-moon-button");
  
    fireEvent.click(sunButton);
    expect(document.documentElement.classList.contains("dark")).toBeTruthy();
  
    fireEvent.click(moonButton);
    expect(document.documentElement.classList.contains("dark")).toBeFalsy();
  });
  
});
