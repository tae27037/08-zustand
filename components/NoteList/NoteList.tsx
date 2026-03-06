"use client";

import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteNote } from "@/lib/api";
import type { Note } from "@/types/note";

import css from "./NoteList.module.css";

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.item}>
          <div className={css.header}>
            <h3 className={css.title}>{note.title}</h3>
            <p className={css.tag}>{note.tag}</p>
          </div>

          {/* ✅ обязательно показываем content */}
          <p className={css.content}>{note.content}</p>

          <div className={css.actions}>
            <Link className={css.link} href={`/notes/${note.id}`}>
              View details
            </Link>

            <button
              type="button"
              className={css.button}
              onClick={() => mutation.mutate(note.id)}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Deleting..." : "Delete"}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
