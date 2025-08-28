
export interface User {
  name?: string;
  email?: string;
  profilePicture?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}
