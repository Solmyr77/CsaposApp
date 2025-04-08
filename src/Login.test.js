import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "./Login";
import Context from "./Context";
import axios from "axios";
import { BrowserRouter } from "react-router-dom";

jest.mock("axios");

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const mockSetIsAuthenticated = jest.fn();
const mockSetUserId = jest.fn();
const mockDecodeJWT = jest.fn();

const renderComponent = () => {
  return render(
    <Context.Provider
      value={{
        setIsAuthenticated: mockSetIsAuthenticated,
        setUserId: mockSetUserId,
        decodeJWT: mockDecodeJWT,
      }}
    >
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </Context.Provider>
  );
};

describe("Login Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders login form inputs and button", () => {
    renderComponent();

    expect(screen.getByLabelText(/felhasználónév/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/jelszó/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /bejelentkezés/i })).toBeInTheDocument();
  });

  test("shows error for incorrect login (401)", async () => {
    axios.post.mockRejectedValueOnce({
      response: { status: 401 },
    });

    renderComponent();

    fireEvent.change(screen.getByLabelText(/felhasználónév/i), {
      target: { value: "wronguser" },
    });
    fireEvent.change(screen.getByLabelText(/jelszó/i), {
      target: { value: "wrongpass" },
    });

    fireEvent.click(screen.getByRole("button", { name: /bejelentkezés/i }));

    expect(await screen.findByText(/hibás felhasználónév vagy jelszó/i)).toBeInTheDocument();
  });

  test("shows error if decoded JWT role is not manager", async () => {
    axios.post.mockResolvedValueOnce({
      status: 200,
      data: {
        accessToken: "fakeAccess",
        refreshToken: "fakeRefresh",
      },
    });

    mockDecodeJWT.mockReturnValueOnce({ role: "user" });

    renderComponent();

    fireEvent.change(screen.getByLabelText(/felhasználónév/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText(/jelszó/i), {
      target: { value: "testpass" },
    });

    fireEvent.click(screen.getByRole("button", { name: /bejelentkezés/i }));

    expect(await screen.findByText(/hibás felhasználónév vagy jelszó/i)).toBeInTheDocument();
    expect(mockSetIsAuthenticated).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("logs in successfully with correct credentials and manager role", async () => {
    axios.post.mockResolvedValueOnce({
      status: 200,
      data: {
        accessToken: "validAccess",
        refreshToken: "validRefresh",
      },
    });

    mockDecodeJWT.mockReturnValueOnce({ role: "manager" });

    renderComponent();

    fireEvent.change(screen.getByLabelText(/felhasználónév/i), {
      target: { value: "manageruser" },
    });
    fireEvent.change(screen.getByLabelText(/jelszó/i), {
      target: { value: "securepass" },
    });

    fireEvent.click(screen.getByRole("button", { name: /bejelentkezés/i }));

    await waitFor(() => {
      expect(mockSetIsAuthenticated).toHaveBeenCalledWith(true);
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    expect(localStorage.getItem("accessToken")).toBe(JSON.stringify("validAccess"));
    expect(localStorage.getItem("refreshToken")).toBe(JSON.stringify("validRefresh"));
  });
});
