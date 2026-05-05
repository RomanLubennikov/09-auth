import { apiInstance } from './api';
import { AxiosResponse } from 'axios';

// Types
export interface User {
  email: string;
  username: string;
  avatar: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface UpdateUserRequest {
  username: string;
}

// Auth functions
export const login = async (data: LoginRequest): Promise<AxiosResponse<User>> => {
  return apiInstance.post('/auth/login', data);
};

export const register = async (data: RegisterRequest): Promise<AxiosResponse<User>> => {
  return apiInstance.post('/auth/register', data);
};

export const logout = async (): Promise<AxiosResponse<void>> => {
  return apiInstance.post('/auth/logout');
};

export const checkSession = async (): Promise<AxiosResponse<User | null>> => {
  return apiInstance.get('/auth/session');
};

export const getMe = async (): Promise<AxiosResponse<User>> => {
  return apiInstance.get('/users/me');
};

export const updateMe = async (data: UpdateUserRequest): Promise<AxiosResponse<User>> => {
  return apiInstance.patch('/users/me', data);
};

// Notes functions
export interface Note {
  id: string;
  title: string;
  content: string;
  tag: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteRequest {
  title: string;
  content: string;
  tag: string;
}

export interface FetchNotesParams {
  search?: string;
  page?: number;
  perPage?: number;
  tag?: string;
}

export const fetchNotes = async (params: FetchNotesParams = {}): Promise<AxiosResponse<Note[]>> => {
  return apiInstance.get('/notes', { params });
};

export const fetchNoteById = async (id: string): Promise<AxiosResponse<Note>> => {
  return apiInstance.get(`/notes/${id}`);
};

export const createNote = async (data: CreateNoteRequest): Promise<AxiosResponse<Note>> => {
  return apiInstance.post('/notes', data);
};

export const deleteNote = async (id: string): Promise<AxiosResponse<Note>> => {
  return apiInstance.delete(`/notes/${id}`);
};
