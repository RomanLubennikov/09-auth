import axios, { AxiosError } from "axios";

export const API_BASE_URL = "https://notehub-api.goit.study";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const DEFAULT_PER_PAGE = 12;

export function isAxiosError(error: unknown): error is AxiosError {
  return axios.isAxiosError(error);
}

export function logErrorResponse(error: unknown) {
  if (isAxiosError(error) && error.response) {
    console.error("API Error:", error.response.status, error.response.data);
  } else {
    console.error("API Error:", error);
  }
}
