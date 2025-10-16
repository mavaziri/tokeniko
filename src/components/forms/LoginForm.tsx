'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Card,
  Form,
  Button,
  Alert,
  Container,
  Row,
  Col,
} from 'react-bootstrap';
import { loginSchema, type LoginFormData } from '@/schemas/validation';
import { LoginRecordClass } from '@/utils/classes';
import { ActivityType, ApiResponse, AuthUser } from '@/types';

interface LoginFormProps {
  onLoginSuccess?: (user: AuthUser) => void;
  onNavigateToRegister?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onLoginSuccess,
  onNavigateToRegister,
}) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: LoginFormData): Promise<void> => {
    setIsSubmitting(true);

    setSubmitError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const response: ApiResponse<AuthUser> = await authenticateUser(data);

      if (response.success && response.data) {
        await createLoginRecord(response.data.id, ActivityType.LOGIN);

        reset();
        onLoginSuccess?.(response.data);
      } else {
        setSubmitError(response.error || 'Login failed');
      }
    } catch (error) {
      setSubmitError('An unexpected error occurred during login');

      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const authenticateUser = async (
    credentials: LoginFormData
  ): Promise<ApiResponse<AuthUser>> => {
    try {
      const usersData = await import('@/data/users.json');
      console.log('usersData', usersData);

      const users = usersData.default;

      const user = users.find(
        (user) =>
          user.email === credentials.username ||
          user.mobileNumber === credentials.username
      );

      if (!user) {
        return {
          success: false,
          error: 'Invalid username or password',
        };
      }

      if (!credentials.password) {
        return {
          success: false,
          error: 'Password is required',
        };
      }

      const authUser: AuthUser = {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        mobileNumber: user.mobileNumber,
      };

      return {
        success: true,
        data: authUser,
        message: 'Login successful',
      };
    } catch (error) {
      return {
        success: false,
        error: 'Authentication service unavailable',
      };
    }
  };

  const createLoginRecord = async (
    userId: string,
    activityType: ActivityType
  ): Promise<void> => {
    try {
      const loginRecord = new LoginRecordClass(
        userId,
        activityType,
        '192.168.1.1',
        navigator.userAgent
      );

      console.log('Login record created:', loginRecord.toJSON());
    } catch (error) {
      console.error('Failed to create login record:', error);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs={12} md={6} lg={4}>
          <Card className="shadow">
            <Card.Header className="bg-success text-white text-center">
              <h3 className="mb-0">Welcome Back</h3>
            </Card.Header>
            <Card.Body className="p-4">
              {submitError && (
                <Alert variant="danger" className="mb-4">
                  <strong>Login Failed:</strong> {submitError}
                </Alert>
              )}

              <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Username <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your email or mobile number"
                    {...register('username')}
                    isInvalid={!!errors.username}
                    disabled={isSubmitting}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.username?.message}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    You can use your email address or mobile number to log in.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>
                    Password <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    {...register('password')}
                    isInvalid={!!errors.password}
                    disabled={isSubmitting}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button
                    type="submit"
                    variant="success"
                    size="lg"
                    disabled={isSubmitting || !isValid}
                  >
                    {isSubmitting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        />
                        Signing In...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </div>

                {onNavigateToRegister && (
                  <div className="text-center mt-3">
                    <p className="mb-0">
                      Don't have an account?{' '}
                      <Button
                        variant="link"
                        className="p-0"
                        onClick={onNavigateToRegister}
                        disabled={isSubmitting}
                      >
                        Create one here
                      </Button>
                    </p>
                  </div>
                )}
              </Form>

              <hr className="my-4" />

              <div className="text-center">
                <h6 className="text-muted mb-3">Demo Credentials</h6>
                <div className="small text-muted">
                  <p className="mb-1">
                    <strong>Email:</strong> john.doe@example.com
                  </p>
                  <p className="mb-1">
                    <strong>Mobile:</strong> +1234567890
                  </p>
                  <p className="mb-0">
                    <strong>Password:</strong> Any password will work for demo
                  </p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginForm;
