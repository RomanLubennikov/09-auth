import { cookies } from "next/headers";
import { apiInstance } from "./api";
import { User } from "@/types/user";
import { Note, NoteTag } from "@/types/note";

export interface FetchNotesParams {
  search?: string;
  page?: number;
  perPage?: number;
  tag?: NoteTag;
}

const getCookieHeader = async () => {
  const cookieStore = await cookies();
  return cookieStore.toString();
};

// Server-side functions
export const fetchNotes = async (params: FetchNotesParams = {}) => {
  const cookieHeader = await getCookieHeader();
  const response = await apiInstance.get<{
    notes: Note[];
    totalPages: number;
    page: number;
    total: number;
  }>("/notes", {
    params,
    headers: { Cookie: cookieHeader },
  });
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const cookieHeader = await getCookieHeader();
  const response = await apiInstance.get<Note>(`/notes/${id}`, {
    headers: { Cookie: cookieHeader },
  });
  return response.data;
};

export const getMe = async (): Promise<User> => {
  const cookieHeader = await getCookieHeader();
  const response = await apiInstance.get<User>("/users/me", {
    headers: { Cookie: cookieHeader },
  });
  return response.data;
};

export const checkSession = async () => {
  const cookieHeader = await getCookieHeader();
  return apiInstance.get<User | null>("/auth/session", {
    headers: { Cookie: cookieHeader },
  });
};
