export interface BaseEntity {
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  [key: string]: unknown;
}

export interface UserRegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  address: string;
}

export interface User extends BaseEntity, UserRegistrationData {
  readonly fullName: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export interface Order extends BaseEntity {
  readonly orderNumber: string;
  readonly buyerName: string;
  readonly status: OrderStatus;
  readonly orderDate: Date;
}

export enum ActivityType {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
}

export interface LoginRecord extends BaseEntity {
  readonly userId: string;
  readonly activityType: ActivityType;
  readonly timestamp: Date;
  readonly ipAddress?: string | undefined;
  readonly userAgent?: string | undefined;
}

export enum FilterOperator {
  EQUALS = 'EQUALS',
  CONTAINS = 'CONTAINS',
  STARTS_WITH = 'STARTS_WITH',
  ENDS_WITH = 'ENDS_WITH',
  GREATER_THAN = 'GREATER_THAN',
  LESS_THAN = 'LESS_THAN',
}

export interface FilterCriteria<T extends Record<string, unknown>> {
  readonly field: keyof T;
  readonly value: T[keyof T];
  readonly operator: FilterOperator;
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export interface SearchParameters<T extends Record<string, unknown>> {
  readonly query?: string | undefined;
  readonly filters?: FilterCriteria<T>[];
  readonly sortBy?: keyof T;
  readonly sortOrder?: SortOrder;
  readonly page?: number;
  readonly limit?: number;
}

export interface ApiResponse<T> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: string;
  readonly message?: string;
}

export interface PaginationMeta {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly totalItems: number;
  readonly itemsPerPage: number;
  readonly hasNextPage: boolean;
  readonly hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  readonly meta?: PaginationMeta;
}

export interface AuthUser {
  readonly id: string;
  readonly email: string;
  readonly fullName: string;
  readonly mobileNumber: string;
}

export interface AuthState {
  readonly user: AuthUser | null;
  readonly isAuthenticated: boolean;
  readonly isLoading: boolean;
}

export interface ValidationError {
  readonly field: string;
  readonly message: string;
}

export interface FormState<T> {
  readonly data: T;
  readonly errors: ValidationError[];
  readonly isValid: boolean;
  readonly isSubmitting: boolean;
}
