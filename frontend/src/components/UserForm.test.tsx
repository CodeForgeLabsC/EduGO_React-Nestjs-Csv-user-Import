import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserForm } from '../components/UserForm';
import * as api from '../services/api';

jest.mock('../services/api');

describe('UserForm Component', () => {
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockOnSuccess.mockClear();
  });

  it('renders the form with input fields', () => {
    render(<UserForm onSuccess={mockOnSuccess} />);

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create user/i })).toBeInTheDocument();
  });

  it('shows validation error when fields are empty', async () => {
    render(<UserForm onSuccess={mockOnSuccess} />);

    const submitButton = screen.getByRole('button', { name: /create user/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/please fill in all fields/i)).toBeInTheDocument();
    });
  });

  it('successfully creates a user', async () => {
    const mockUser = {
      id: '123',
      username: 'testuser',
      email: 'test@pl.com',
      createdAt: new Date().toISOString(),
    };

    (api.usersApi.createUser as jest.Mock).mockResolvedValue(mockUser);

    render(<UserForm onSuccess={mockOnSuccess} />);

    const usernameInput = screen.getByLabelText(/username/i);
    const emailInput = screen.getByLabelText(/email/i);

    await userEvent.type(usernameInput, 'testuser');
    await userEvent.type(emailInput, 'test@pl.com');

    const submitButton = screen.getByRole('button', { name: /create user/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(api.usersApi.createUser).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'test@pl.com',
      });
      expect(mockOnSuccess).toHaveBeenCalledWith(mockUser);
    });
  });

  it('handles API error and displays error message', async () => {
    (api.usersApi.createUser as jest.Mock).mockRejectedValue(
      new Error('Email already exists'),
    );
    (api.usersApi.getErrorMessage as jest.Mock).mockReturnValue('Email already exists');

    render(<UserForm onSuccess={mockOnSuccess} />);

    const usernameInput = screen.getByLabelText(/username/i);
    const emailInput = screen.getByLabelText(/email/i);

    await userEvent.type(usernameInput, 'testuser');
    await userEvent.type(emailInput, 'existing@pl.com');

    const submitButton = screen.getByRole('button', { name: /create user/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email already exists/i)).toBeInTheDocument();
    });
  });
});
