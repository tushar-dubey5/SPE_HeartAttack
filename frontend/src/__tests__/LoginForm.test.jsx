import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import '@testing-library/jest-dom';

// Mock the useNavigate hook
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUsedNavigate,
    useParams: () => ({ role: 'PATIENT' })
}));

// Mock axios
jest.mock('axios');

describe('LoginForm Component', () => {
    beforeEach(() => {
        // Clear mock data before each test
        jest.clearAllMocks();
    });

    test('renders login form with email and password fields', () => {
        render(
            <BrowserRouter>
                <LoginForm />
            </BrowserRouter>
        );

        expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    test('shows error message for empty fields', async () => {
        render(
            <BrowserRouter>
                <LoginForm />
            </BrowserRouter>
        );

        const loginButton = screen.getByRole('button', { name: /login/i });
        fireEvent.click(loginButton);

        await waitFor(() => {
            expect(screen.getByText(/invalid credentials or role/i)).toBeInTheDocument();
        });
    });

    test('handles email input change', () => {
        render(
            <BrowserRouter>
                <LoginForm />
            </BrowserRouter>
        );

        const emailInput = screen.getByPlaceholderText(/email/i);
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

        expect(emailInput.value).toBe('test@example.com');
    });

    test('handles password input change', () => {
        render(
            <BrowserRouter>
                <LoginForm />
            </BrowserRouter>
        );

        const passwordInput = screen.getByPlaceholderText(/password/i);
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        expect(passwordInput.value).toBe('password123');
    });
}); 