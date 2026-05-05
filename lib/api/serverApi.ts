import axios from "axios";
import { cookies } from "next/headers";
import { AxiosResponse } from "axios";

// Types
export interface User {
  email: string;
  username: string;
  avatar: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tag: string;
  createdAt: string;
  updatedAt: string;
}

export interface FetchNotesParams {
  search?: string;
  page?: number;
  perPage?: number;
  tag?: string;
}

// Create server-side API instance with cookies dynamically
const createServerApiInstance = async () => {
  const cookieStore = await cookies();
  const baseURL =
    (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000") + "/api";
  return axios.create({
    baseURL,
    withCredentials: true,
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
};

// Server-side functions
export const fetchNotes = async (
  params: FetchNotesParams = {}
): Promise<AxiosResponse<Note[]>> => {
  const instance = await createServerApiInstance();
  return instance.get("/notes", { params });
};

export const fetchNoteById = async (
  id: string
): Promise<AxiosResponse<Note>> => {
  const instance = await createServerApiInstance();
  return instance.get(`/notes/${id}`);
};

export const getMe = async (): Promise<AxiosResponse<User>> => {
  const instance = await createServerApiInstance();
  return instance.get("/users/me");
};

export const checkSession = async (): Promise<AxiosResponse<User | null>> => {
  const instance = await createServerApiInstance();
  return instance.get("/auth/session");
};
