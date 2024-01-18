import { render, screen } from "@testing-library/react";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { server } from "../mocks/server";
import MainPage from "./MainPage";

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

const customRender = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <UserContext.Provider value={providerProps}>{ui}</UserContext.Provider>,
    renderOptions
  );
};

describe("Main Page", () => {
  let providerProps;

  beforeEach(() => {
    providerProps = {
      setUser: jest.fn(),
    };
  });

  test("should render correctly", () => {
    customRender(
      <Router>
        <MainPage />
      </Router>,
      { providerProps }
    );
  });

  test("should display a sidebar", () => {
    customRender(
      <Router>
        <MainPage />
      </Router>,
      { providerProps }
    );

    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  test("should display a header", () => {
    customRender(
      <Router>
        <MainPage />
      </Router>,
      { providerProps }
    );

    expect(screen.getByRole("banner")).toBeInTheDocument();
  });
});
