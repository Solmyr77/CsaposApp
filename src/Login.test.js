import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';
import Context from './Context';

jest.mock('axios');
const mockSetIsAuthenticated = jest.fn();
const mockSetUserId = jest.fn();
const mockDecodeJWT = jest.fn();

describe('Login Component', () => {
  const renderLogin = () => {
    return render(
      <BrowserRouter>
        <Context.Provider value={{
          setIsAuthenticated: mockSetIsAuthenticated,
          setUserId: mockSetUserId,
          decodeJWT: mockDecodeJWT
        }}>
          <Login />
        </Context.Provider>
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('1. allows typing in username field', () => {
    renderLogin();
    const usernameInput = screen.getByLabelText('Felhasználónév');
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    expect(usernameInput).toHaveValue('testuser');
  });

  test('2. allows typing in password field', () => {
    renderLogin();
    const passwordInput = screen.getByLabelText('Jelszó');
    fireEvent.change(passwordInput, { target: { value: 'testpass' } });
    expect(passwordInput).toHaveValue('testpass');
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
});