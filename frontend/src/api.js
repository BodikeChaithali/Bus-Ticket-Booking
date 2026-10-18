export const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// fetch wrapper: adds the base URL, JSON header and the logged-in user's token
export function apiFetch(path, options = {}) {
  const token = localStorage.getItem("token");
  return fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
}