import { QueryClient, dehydrate } from "@tanstack/react-query";
import { HydrationBoundary } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api/serverApi";
import { NoteTag } from "@/types/note";
import NotesClient from "./Notes.client";

interface FilterPageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function FilterPage({ params }: FilterPageProps) {
  const { slug } = await params;

  // Parse filter params from slug
  const tagValue = slug[0] || "All";
  const tag = tagValue === "All" ? undefined : (tagValue as NoteTag);
  const search = slug[1] || "";

  const qc = new QueryClient();

  await qc.prefetchQuery({
    queryKey: [
      "notes",
      {
        tag: tagValue === "All" ? undefined : tag,
        search,
        page: 1,
        perPage: 12,
      },
    ],
    queryFn: () =>
      fetchNotes({
        tag,
        search: search || undefined,
        page: 1,
        perPage: 12,
      }),
  });

  const dehydrated = dehydrate(qc);

  return (
    <HydrationBoundary state={dehydrated}>
      <NotesClient initialTag={tagValue} initialSearch={search} />
    </HydrationBoundary>
  );
}
