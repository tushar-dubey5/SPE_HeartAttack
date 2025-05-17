import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RegisterPatientForm from '../components/RegisterPatientForm';
import '@testing-library/jest-dom';

// Mock the useNavigate hook
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUsedNavigate,
}));

// Mock axios
jest.mock('axios');

describe('RegisterPatientForm Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders registration form with all required fields', () => {
        render(
            <BrowserRouter>
                <RegisterPatientForm />
            </BrowserRouter>
        );

        expect(screen.getByPlaceholderText(/full name/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
    });

    test('shows error message for empty fields', async () => {
        render(
            <BrowserRouter>
                <RegisterPatientForm />
            </BrowserRouter>
        );

        const registerButton = screen.getByRole('button', { name: /register/i });
        fireEvent.click(registerButton);

        await waitFor(() => {
            expect(screen.getByText(/registration failed/i)).toBeInTheDocument();
        });
    });

    test('validates email format', async () => {
        render(
            <BrowserRouter>
                <RegisterPatientForm />
            </BrowserRouter>
        );

        const emailInput = screen.getByPlaceholderText(/email/i);
        fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

        const registerButton = screen.getByRole('button', { name: /register/i });
        fireEvent.click(registerButton);

        await waitFor(() => {
            expect(screen.getByText(/registration failed/i)).toBeInTheDocument();
        });
    });

    test('validates password requirements', async () => {
        render(
            <BrowserRouter>
                <RegisterPatientForm />
            </BrowserRouter>
        );

        const passwordInput = screen.getByPlaceholderText(/password/i);
        fireEvent.change(passwordInput, { target: { value: 'weak' } });

        const registerButton = screen.getByRole('button', { name: /register/i });
        fireEvent.click(registerButton);

        await waitFor(() => {
            expect(screen.getByText(/registration failed/i)).toBeInTheDocument();
        });
    });

    test('handles form submission with valid data', async () => {
        render(
            <BrowserRouter>
                <RegisterPatientForm />
            </BrowserRouter>
        );

        // Fill in the form with valid data
        fireEvent.change(screen.getByPlaceholderText(/full name/i), { target: { value: 'Test User' } });
        fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'Test@123' } });

        const registerButton = screen.getByRole('button', { name: /register/i });
        fireEvent.click(registerButton);

        // Verify form submission
        await waitFor(() => {
            expect(screen.queryByText(/registration failed/i)).not.toBeInTheDocument();
        });
    });
}); 