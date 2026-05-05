import { fetchNotes } from "@/lib/api/serverApi";
import { NoteTag } from "@/types/note";
import NotesClient from "./Notes.client";

interface FilterPageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function FilterPage({ params }: FilterPageProps) {
  const { slug } = await params;

  // Parse filter params from slug
  const tagValue = slug[0];
  const tag = tagValue === "All" ? undefined : (tagValue as NoteTag);
  const search = slug[1] || "";

  const response = await fetchNotes({
    tag,
    search: search || undefined,
    page: 1,
    perPage: 12,
  });

  const notesData = response.data;

  return (
    <NotesClient
      initialNotes={notesData.notes}
      initialTotalPages={notesData.totalPages}
      initialPage={notesData.page}
      initialTotal={notesData.total}
      initialTag={tagValue}
      initialSearch={search}
    />
  );
}
