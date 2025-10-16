'use client';

import React, { useEffect, useCallback, useState } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { useAuth } from '@/contexts/AuthContext';
import { RegistrationForm } from '@/components/forms/RegistrationForm';
import { LoginForm } from '@/components/forms/LoginForm';
import { Dashboard } from '@/components/Dashboard';
import type { AuthUser } from '@/types';

type AppView = 'login' | 'register' | 'dashboard';

export const AppContent: React.FC = () => {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();
  const [currentView, setCurrentView] = useState<AppView>('login');

  useEffect(() => {
    if (isAuthenticated) {
      setCurrentView('dashboard');
    } else {
      setCurrentView('login');
    }
  }, [isAuthenticated]);

  const handleLoginSuccess = useCallback(
    (authUser: AuthUser): void => {
      login(authUser);

      setCurrentView('dashboard');
    },
    [login]
  );

  const handleRegistrationSuccess = useCallback((): void => {
    setCurrentView('login');
  }, []);

  const handleLogout = useCallback((): void => {
    logout();

    setCurrentView('login');
  }, [logout]);

  const navigateToRegister = useCallback((): void => {
    setCurrentView('register');
  }, []);

  const navigateToLogin = useCallback((): void => {
    setCurrentView('login');
  }, []);

  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Row>
          <Col className="text-center">
            <Spinner animation="border" variant="primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="mt-3 text-muted">Initializing application...</p>
          </Col>
        </Row>
      </Container>
    );
  }

  switch (currentView) {
    case 'register':
      return (
        <RegistrationForm
          onRegistrationSuccess={handleRegistrationSuccess}
          onNavigateToLogin={navigateToLogin}
        />
      );

    case 'dashboard':
      return user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <LoginForm
          onLoginSuccess={handleLoginSuccess}
          onNavigateToRegister={navigateToRegister}
        />
      );

    case 'login':
    default:
      return (
        <LoginForm
          onLoginSuccess={handleLoginSuccess}
          onNavigateToRegister={navigateToRegister}
        />
      );
  }
};
