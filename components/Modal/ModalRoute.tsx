"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import Modal from "./Modal";

type Props = {
  children: ReactNode;
};

export default function ModalRoute({ children }: Props) {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  return <Modal onClose={handleClose}>{children}</Modal>;
}
