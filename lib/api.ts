import axios from "axios";
import type { CreateNotePayload, Note } from "@/types/note";
import type { FetchNotesResponse } from "@/types/api";

const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_NOTEHUB_BASE_URL,
  headers: {
    Authorization: token ? `Bearer ${token}` : "",
  },
});

export type FetchNotesParams = {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string; // ✅ для фільтрації
};

export async function fetchNotes(
  params: FetchNotesParams = {},
): Promise<FetchNotesResponse> {
  const { tag, ...rest } = params;

  const requestParams = tag && tag !== "all" ? { ...rest, tag } : rest;

  const { data } = await apiClient.get<FetchNotesResponse>("/notes", {
    params: requestParams,
  });

  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await apiClient.get<Note>(`/notes/${id}`);
  return data;
}

export async function createNote(payload: CreateNotePayload): Promise<Note> {
  const { data } = await apiClient.post<Note>("/notes", payload);
  return data;
}

export async function deleteNote(id: string): Promise<Note> {
  const { data } = await apiClient.delete<Note>(`/notes/${id}`);
  return data;
}
