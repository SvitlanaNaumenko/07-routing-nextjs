import axios from 'axios';
import type { Note, CreateNoteDto } from '../types/note';

export type { Note, CreateNoteDto };

// Створено окремий екземпляр axios із базовою URL-адресою бекенду
const api = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
  },
});

// Інтерфейс відповіді від сервера для списку нотаток (пагінація)
export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

// Параметри для пагінації, пошуку та фільтрації за тегом
export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string; // Додано параметр для фільтрації за тегом
}

// Функція для отримання однієї нотатки за її id
export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await api.get<Note>(`/notes/${id}`);
  return response.data;
};

// 1. Отримання нотаток з пагінацією та фільтрацією за пошуковим словом і тегом
export const fetchNotes = async (params: FetchNotesParams = {}): Promise<FetchNotesResponse> => {
  const queryParams: FetchNotesParams = { ...params };

  // Якщо тег дорівнює 'all', видаляємо його з параметрів, щоб не відправляти на бекенд
  if (queryParams.tag === 'all') {
    delete queryParams.tag;
  }

  const response = await api.get<FetchNotesResponse>('/notes', {
    params: queryParams,
  });
  return response.data;
};

// 2. Створення нової нотатки
export const createNote = async (noteData: CreateNoteDto): Promise<Note> => {
  const response = await api.post<Note>('/notes', noteData);
  return response.data;
};

// 3. Видалення нотатки за її ID
export const deleteNote = async (id: string): Promise<Note> => {
  const response = await api.delete<Note>(`/notes/${id}`);
  return response.data;
};
