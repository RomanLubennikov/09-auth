"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchNotes } from "@/lib/api/clientApi";
import { NoteTag } from "@/types/note";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import css from "../../NotesPage.module.css";

interface NotesClientProps {
  initialTag: NoteTag | string;
  initialSearch: string;
}

const TAGS: (NoteTag | "All")[] = [
  "All",
  "Todo",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
];

export default function NotesClient({
  initialTag,
  initialSearch,
}: NotesClientProps) {
  const router = useRouter();

  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [page, setPage] = useState(1);
  const [tag, setTag] = useState<NoteTag | "All">(
    (initialTag as NoteTag | "All") || "All"
  );

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Update URL when filters change
  useEffect(() => {
    const newSlug = [tag === "All" ? "All" : tag, debouncedSearch || ""];
    router.push(`/notes/filter/${newSlug.join("/")}`);
  }, [tag, debouncedSearch, router]);

  const { data, isLoading } = useQuery({
    queryKey: [
      "notes",
      {
        tag: tag === "All" ? "" : tag,
        search: debouncedSearch,
        page,
        perPage: 12,
      },
    ],
    queryFn: async () => {
      const res = await fetchNotes({
        tag: (tag === "All" ? "" : tag) as NoteTag,
        search: debouncedSearch || "",
        page,
        perPage: 12,
      });
      return res.data;
    },
  });

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleTagChange = useCallback((newTag: NoteTag | "All") => {
    setTag(newTag);
    setPage(1);
  }, []);

  return (
    <div className={css.container}>
      <h1 className={css.title}>Notes</h1>

      <Link href="/notes/action/create" className={css.createLink}>
        Create Note
      </Link>

      <SearchBox value={search} onChange={setSearch} />

      {/* Tag Filter */}
      <div className={css.tagFilter}>
        {TAGS.map((t) => (
          <button
            key={t}
            onClick={() => handleTagChange(t)}
            className={tag === t ? css.activeTag : css.tagButton}
          >
            {t}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className={css.loading}>Loading notes...</p>
      ) : data?.notes && data.notes.length > 0 ? (
        <NoteList notes={data.notes} />
      ) : (
        <p className={css.empty}>No notes found.</p>
      )}

      {data && data.totalPages > 1 && (
        <Pagination
          pageCount={data.totalPages}
          currentPage={page}
          onPageChange={handlePageChange}
        />
      )}

      <p className={css.totalInfo}>Total notes: {data?.total || 0}</p>
    </div>
  );
}
