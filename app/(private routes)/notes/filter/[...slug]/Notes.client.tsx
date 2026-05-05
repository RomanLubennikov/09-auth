"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { fetchNotes } from "@/lib/api/clientApi";
import { Note, NoteTag } from "@/types/note";
import css from "../../NotesPage.module.css";

interface NotesClientProps {
  initialNotes: Note[];
  initialTotalPages: number;
  initialPage: number;
  initialTotal: number;
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
  initialNotes,
  initialTotalPages,
  initialPage,
  initialTotal,
  initialTag,
  initialSearch,
}: NotesClientProps) {
  const router = useRouter();
  const params = useParams();
  const slug = (params.slug as string[]) || [];

  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [page, setPage] = useState(initialPage);
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
        tag: tag === "All" ? undefined : tag,
        search: debouncedSearch,
        page,
        perPage: 12,
      },
    ],
    queryFn: async () => {
      const res = await fetchNotes({
        tag: tag === "All" ? undefined : (tag as NoteTag),
        search: debouncedSearch || undefined,
        page,
        perPage: 12,
      });
      return res.data;
    },
    initialData: {
      notes: initialNotes,
      totalPages: initialTotalPages,
      page: initialPage,
      total: initialTotal,
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

      {/* Search Box */}
      <div className={css.searchBox}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search notes..."
          className={css.searchInput}
        />
      </div>

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

      {/* Note List */}
      {isLoading ? (
        <p className={css.loading}>Loading notes...</p>
      ) : (
        <ul className={css.list}>
          {data?.notes.map((note) => (
            <li key={note.id} className={css.item}>
              <h2>{note.title}</h2>
              <span className={css.tag}>{note.tag}</span>
              <p className={css.content}>{note.content}</p>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className={css.pagination}>
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
            className={css.pageButton}
          >
            Previous
          </button>
          <span className={css.pageInfo}>
            Page {page} of {data.totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= data.totalPages}
            className={css.pageButton}
          >
            Next
          </button>
        </div>
      )}

      <p className={css.totalInfo}>Total notes: {data?.total || 0}</p>
    </div>
  );
}
