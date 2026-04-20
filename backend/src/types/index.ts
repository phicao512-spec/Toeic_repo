export type UserRole = 'STUDENT' | 'ADMIN' | 'CONTENT_CREATOR';

export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: UserRole;
}