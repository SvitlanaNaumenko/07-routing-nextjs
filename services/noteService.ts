import axios from 'axios';
import type { Note, CreateNoteDto } from '../types/note';

const api = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
  },
});

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
}

export const fetchNotes = async (params: FetchNotesParams = {}): Promise<FetchNotesResponse> => {
  const queryParams: Record<string, string | number> = {};

  if (params.page) {
    queryParams.page = params.page;
  }

  if (params.perPage) {
    queryParams.perPage = params.perPage;
  }

  if (params.search && params.search.trim() !== '') {
    queryParams.search = params.search.trim();
  }

  if (params.tag && params.tag !== 'all') {
    queryParams.tag = params.tag;
  }

  const response = await api.get<FetchNotesResponse>('/notes', {
    params: queryParams,
  });

  return response.data;
};

export const createNote = async (noteData: CreateNoteDto): Promise<Note> => {
  const response = await api.post<Note>('/notes', noteData);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await api.delete<Note>(`/notes/${id}`);
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await api.get<Note>(`/notes/${id}`);
  return response.data;
};
