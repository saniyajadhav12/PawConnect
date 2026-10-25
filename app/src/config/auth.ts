// Stores the logged-in session (JWT, user id and role) in localStorage.
// The role only drives what the UI shows; the backend enforces access on every request.
const TOKEN_KEY = "token";
const USER_ID_KEY = "userId";
const ROLE_KEY = "role";

export type Role = "USER" | "NGO" | "ADMIN";

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);

export const getUserId = (): string | null => localStorage.getItem(USER_ID_KEY);

export const getRole = (): Role | null => localStorage.getItem(ROLE_KEY) as Role | null;

export const isLoggedIn = (): boolean => Boolean(getToken());

export const hasRole = (...roles: Role[]): boolean => {
  const role = getRole();
  return role !== null && roles.includes(role);
};

export const saveSession = (token: string, userId: string, role: Role): void => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_ID_KEY, userId);
  localStorage.setItem(ROLE_KEY, role);
};

export const clearSession = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_ID_KEY);
  localStorage.removeItem(ROLE_KEY);
};
