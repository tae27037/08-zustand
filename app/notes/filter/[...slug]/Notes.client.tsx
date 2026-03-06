"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { fetchNotes } from "@/lib/api";
import type { Note } from "@/types/note";

import NoteList from "@/components/NoteList/NoteList";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";

import css from "./page.module.css";

type Props = {
  tag?: string;
};

export default function NotesClient({ tag }: Props) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", tag ?? "all", page, debouncedSearch],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: 12,
        search: debouncedSearch || undefined,
        tag,
      }),
  });

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const notes: Note[] = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className={css.wrapper}>
      <div className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearchChange} />
        <button type="button" className={css.button} onClick={openModal}>
          Create note +
        </button>
      </div>

      {isLoading && <p>Loading...</p>}
      {isError && <p>Failed to load notes.</p>}

      {!isLoading && !isError && notes.length > 0 && <NoteList notes={notes} />}

      {!isLoading && !isError && notes.length === 0 && (
        <p className={css.empty}>No notes found.</p>
      )}

      {!isLoading && !isError && totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onClose={closeModal} />
        </Modal>
      )}
    </div>
  );
}
