import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route, MemoryRouter } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import '@testing-library/jest-dom';

// Mock the useNavigate hook
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUsedNavigate,
}));

describe('Protected Route Access Tests', () => {
    beforeEach(() => {
        // Clear localStorage and mocks before each test
        localStorage.clear();
        jest.clearAllMocks();
    });

    const protectedRoutes = [
        { path: '/patient/dashboard', role: 'PATIENT' },
        { path: '/doctor/dashboard', role: 'DOCTOR' },
        { path: '/admin/dashboard', role: 'ADMIN' },
        { path: '/patient/appointments', role: 'PATIENT' },
        { path: '/doctor/appointments', role: 'DOCTOR' }
    ];

    protectedRoutes.forEach(route => {
        test(`redirects to login when accessing ${route.path} without authentication`, () => {
            render(
                <MemoryRouter initialEntries={[route.path]}>
                    <Routes>
                        <Route
                            path={route.path}
                            element={
                                <ProtectedRoute requiredRole={route.role}>
                                    <div>Protected Content</div>
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </MemoryRouter>
            );

            // Should redirect to login page with appropriate role
            expect(mockedUsedNavigate).toHaveBeenCalledWith(`/login/${route.role}`);
        });

        test(`redirects to login when accessing ${route.path} with wrong role`, () => {
            // Set user with wrong role
            const wrongRole = route.role === 'PATIENT' ? 'DOCTOR' : 'PATIENT';
            localStorage.setItem('user', JSON.stringify({
                role: wrongRole,
                token: 'valid-token'
            }));

            render(
                <MemoryRouter initialEntries={[route.path]}>
                    <Routes>
                        <Route
                            path={route.path}
                            element={
                                <ProtectedRoute requiredRole={route.role}>
                                    <div>Protected Content</div>
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </MemoryRouter>
            );

            // Should redirect to login page with required role
            expect(mockedUsedNavigate).toHaveBeenCalledWith(`/login/${route.role}`);
        });

        test(`allows access to ${route.path} with correct role`, () => {
            // Set user with correct role
            localStorage.setItem('user', JSON.stringify({
                role: route.role,
                token: 'valid-token'
            }));

            render(
                <MemoryRouter initialEntries={[route.path]}>
                    <Routes>
                        <Route
                            path={route.path}
                            element={
                                <ProtectedRoute requiredRole={route.role}>
                                    <div>Protected Content</div>
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </MemoryRouter>
            );

            // Should not redirect
            expect(mockedUsedNavigate).not.toHaveBeenCalled();
            expect(screen.getByText('Protected Content')).toBeInTheDocument();
        });
    });

    test('redirects to login when token is invalid or expired', () => {
        // Set user with invalid token
        localStorage.setItem('user', JSON.stringify({
            role: 'PATIENT',
            token: ''
        }));

        render(
            <MemoryRouter initialEntries={['/patient/dashboard']}>
                <Routes>
                    <Route
                        path="/patient/dashboard"
                        element={
                            <ProtectedRoute requiredRole="PATIENT">
                                <div>Protected Content</div>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </MemoryRouter>
        );

        // Should redirect to login page
        expect(mockedUsedNavigate).toHaveBeenCalledWith('/login/PATIENT');
    });
}); 