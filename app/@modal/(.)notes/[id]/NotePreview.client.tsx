"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { fetchNoteById } from "@/lib/api";
import Modal from "@/components/Modal/Modal";
import NotePreview from "@/components/NotePreview/NotePreview";

export default function NotePreviewClient() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  const handleClose = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <Modal onClose={handleClose}>
        <p>Loading...</p>
      </Modal>
    );
  }

  if (isError || !data) {
    return (
      <Modal onClose={handleClose}>
        <p>Failed to load note.</p>
        <button type="button" onClick={handleClose}>
          Close
        </button>
      </Modal>
    );
  }

  return (
    <Modal onClose={handleClose}>
      <button type="button" onClick={handleClose}>
        Close
      </button>
      <NotePreview note={data} />
    </Modal>
  );
}
