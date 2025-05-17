import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import '@testing-library/jest-dom';

// Mock the useNavigate hook
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUsedNavigate,
}));

describe('ProtectedRoute Component', () => {
    const MockComponent = () => <div data-testid="protected-content">Protected Content</div>;

    beforeEach(() => {
        // Clear mock data and localStorage before each test
        jest.clearAllMocks();
        localStorage.clear();
        // Reset navigation mock
        mockedUsedNavigate.mockReset();
    });

    test('redirects to login when user is not authenticated', () => {
        render(
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={
                        <ProtectedRoute requiredRole="PATIENT">
                            <MockComponent />
                        </ProtectedRoute>
                    } />
                </Routes>
            </BrowserRouter>
        );

        expect(mockedUsedNavigate).toHaveBeenCalledWith('/');
    });

    test('renders children when user is authenticated with correct role', () => {
        // Mock authenticated user with correct role
        localStorage.setItem('user', JSON.stringify({
            role: 'PATIENT',
            token: 'dummy-token'
        }));

        render(
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={
                        <ProtectedRoute requiredRole="PATIENT">
                            <MockComponent />
                        </ProtectedRoute>
                    } />
                </Routes>
            </BrowserRouter>
        );

        expect(screen.getByTestId('protected-content')).toBeInTheDocument();
        expect(mockedUsedNavigate).not.toHaveBeenCalled();
    });

    test('redirects when user has wrong role', () => {
        // Mock authenticated user with wrong role
        localStorage.setItem('user', JSON.stringify({
            role: 'DOCTOR',
            token: 'dummy-token'
        }));

        render(
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={
                        <ProtectedRoute requiredRole="PATIENT">
                            <MockComponent />
                        </ProtectedRoute>
                    } />
                </Routes>
            </BrowserRouter>
        );

        expect(mockedUsedNavigate).toHaveBeenCalledWith('/');
    });

    test('redirects when token is invalid', () => {
        // Mock authenticated user with invalid token
        localStorage.setItem('user', JSON.stringify({
            role: 'PATIENT',
            token: ''
        }));

        render(
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={
                        <ProtectedRoute requiredRole="PATIENT">
                            <MockComponent />
                        </ProtectedRoute>
                    } />
                </Routes>
            </BrowserRouter>
        );

        expect(mockedUsedNavigate).toHaveBeenCalledWith('/');
    });
}); 