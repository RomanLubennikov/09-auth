"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { fetchNoteById } from "@/lib/api/clientApi";
import css from "./NoteDetails.module.css";

export default function NoteDetailsClient() {
  const params = useParams();
  const id = params.id as string;

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: async () => {
      const res = await fetchNoteById(id);
      return res.data;
    },
    refetchOnMount: false,
  });

  if (isLoading) return <p>Loading, please wait...</p>;
  if (error || !response) return <p>Something went wrong.</p>;

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{response.title}</h2>
        </div>

        <p className={css.content}>{response.content}</p>
        <p className={css.date}>{response.createdAt}</p>
      </div>
    </div>
  );
}
