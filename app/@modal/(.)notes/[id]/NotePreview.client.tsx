"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { fetchNoteById } from "@/lib/api/clientApi";
import Modal from "@/components/Modal/Modal";
import css from "@/app/(private routes)/notes/NotePreview.module.css";

interface NotePreviewClientProps {
  id: string;
}

export default function NotePreviewClient({ id }: NotePreviewClientProps) {
  const router = useRouter();

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
    <Modal onClose={() => router.back()}>
      <div className={css.container}>
        <div className={css.item}>
          <div className={css.header}>
            <h2>{response.title}</h2>
            <span className={css.tag}>{response.tag}</span>
          </div>

          <button onClick={() => router.back()}>Close</button>
          <p className={css.content}>{response.content}</p>
          <p className={css.date}>{response.createdAt}</p>
        </div>
      </div>
    </Modal>
  );
}
