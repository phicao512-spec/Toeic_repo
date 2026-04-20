export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "STUDENT" | "ADMIN" | "CONTENT_CREATOR";
  targetScore?: number;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}
