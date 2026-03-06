"use client";

import { useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import css from "./Modal.module.css";

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export default function Modal({ onClose, children }: ModalProps) {
  const isClient = useIsClient();

  useEffect(() => {
    if (!isClient) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isClient, onClose]);

  if (!isClient) return null;

  return createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={css.modal}>{children}</div>
    </div>,
    document.body,
  );
}
