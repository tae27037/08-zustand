import type { Note } from "./note";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}
