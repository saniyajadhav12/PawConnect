// Stores the logged-in session (JWT + user id) in localStorage
const TOKEN_KEY = "token";
const USER_ID_KEY = "userId";

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);

export const getUserId = (): string | null => localStorage.getItem(USER_ID_KEY);

export const isLoggedIn = (): boolean => Boolean(getToken());

export const saveSession = (token: string, userId: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_ID_KEY, userId);
};

export const clearSession = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_ID_KEY);
};
