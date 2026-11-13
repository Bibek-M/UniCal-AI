export const LOCAL_BACKEND_URL = "http://localhost:3000";
export const DEPLOYED_BACKEND_URL = "https://unical-ai.onrender.com";

const envApiUrl = import.meta.env.VITE_API_URL?.trim();

/**
 * Resolves the backend base URL.
 * Priority:
 * 1. Explicit `VITE_API_URL` environment variable (e.g., from .env.production / .env.development)
 * 2. In-browser `localStorage` override ("API_BASE_URL" or "VITE_API_URL") for quick switching/testing
 * 3. Default fallback:
 *    - Development: http://localhost:3000
 *    - Production:  https://unical-ai.onrender.com
 */
export const getApiBaseUrl = (): string => {
  if (envApiUrl) {
    return envApiUrl.replace(/\/+$/, "");
  }

  if (typeof window !== "undefined") {
    try {
      const override =
        window.localStorage.getItem("API_BASE_URL") ||
        window.localStorage.getItem("VITE_API_URL");
      if (override?.trim()) {
        return override.trim().replace(/\/+$/, "");
      }
    } catch {
      // Ignore localStorage access errors (e.g. strict security settings / sandboxed iframes)
    }
  }

  const defaultUrl = import.meta.env.DEV ? LOCAL_BACKEND_URL : DEPLOYED_BACKEND_URL;
  return defaultUrl.replace(/\/+$/, "");
};

export const API_BASE_URL = getApiBaseUrl();
export const apiBaseUrl = API_BASE_URL;

/**
 * Builds a full API endpoint URL using the active backend route.
 * Handles leading/trailing slashes gracefully.
 *
 * Example: apiUrl("/signup") -> "http://localhost:3000/signup" or "https://unical-ai.onrender.com/signup"
 */
export const apiUrl = (path: string) =>
  `${getApiBaseUrl()}/${path.replace(/^\/+/, "")}`;
