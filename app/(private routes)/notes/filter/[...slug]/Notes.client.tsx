"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchNotes, FetchNotesParams } from "@/lib/api/notes";
import css from "../../NotesPage.module.css";

interface NotesClientProps {
  searchParams: FetchNotesParams;
}

export default function NotesClient({ searchParams }: NotesClientProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["notes", searchParams],
    queryFn: () => fetchNotes(searchParams),
  });

  if (isLoading) return <p className={css.loading}>Loading notes...</p>;
  if (error || !data)
    return <p className={css.error}>Something went wrong.</p>;

  return (
    <div className={css.container}>
      <h1 className={css.title}>Notes</h1>
      <ul className={css.list}>
        {data.notes.map((note) => (
          <li key={note.id} className={css.item}>
            <h2>{note.title}</h2>
            <span className={css.tag}>{note.tag}</span>
            <p className={css.content}>{note.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
