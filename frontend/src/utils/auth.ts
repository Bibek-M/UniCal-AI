export interface AuthUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role: "Student" | "Faculty" | "Admin";
  department?: string;
  semester?: string;
  rollNumber?: string;
}

const TOKEN_KEY = "unical_token";
const USER_KEY = "unical_user";

export const setAuth = (token: string, user: AuthUser): void => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (err) {
    console.error("Error writing auth to localStorage:", err);
  }
};

export const getToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY) || localStorage.getItem("token") || null;
  } catch {
    return null;
  }
};

export const getUser = (): AuthUser | null => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
};

export const clearAuth = (): void => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("token");
    localStorage.removeItem(USER_KEY);
  } catch (err) {
    console.error("Error clearing auth from localStorage:", err);
  }
};

export const isAuthenticated = (): boolean => {
  return Boolean(getToken());
};

export const isAdmin = (): boolean => {
  const user = getUser();
  return user?.role === "Admin";
};

export const getAuthHeaders = (): Record<string, string> => {
  const token = getToken();
  if (!token) return {};
  return {
    Authorization: `Bearer ${token}`,
    token: token,
  };
};
