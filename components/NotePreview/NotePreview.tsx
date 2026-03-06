import type { Note } from "@/types/note";
import css from "./NotePreview.module.css";

type Props = {
  note: Note;
};

export default function NotePreview({ note }: Props) {
  return (
    <div className={css.wrapper}>
      <h2 className={css.title}>{note.title}</h2>
      <p className={css.content}>{note.content}</p>
    </div>
  );
}
