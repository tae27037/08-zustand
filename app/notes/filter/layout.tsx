import type { ReactNode } from "react";
import css from "./LayoutNotes.module.css"; // скопіюй готовий файл стилів

type Props = {
  children: ReactNode;
  sidebar: ReactNode;
};

export default function FilterLayout({ children, sidebar }: Props) {
  return (
    <div className={css.wrapper}>
      <aside className={css.sidebar}>{sidebar}</aside>
      <section className={css.content}>{children}</section>
    </div>
  );
}
