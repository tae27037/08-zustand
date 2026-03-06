import type { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";
import css from "./page.module.css";

type Props = {
  params: Promise<{
    slug: string[];
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const filter = slug?.[0] ?? "all";

  return {
    title: `Notes: ${filter} | NoteHub`,
    description: `Browse notes filtered by ${filter} in NoteHub.`,
    openGraph: {
      title: `Notes: ${filter} | NoteHub`,
      description: `Browse notes filtered by ${filter} in NoteHub.`,
      url: `https://your-vercel-url.vercel.app/notes/filter/${filter}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "Filtered notes page",
        },
      ],
    },
  };
}

export default async function FilterNotesPage({ params }: Props) {
  const { slug } = await params;

  const filter = slug?.[0] ?? "all";
  const tag = filter === "all" ? undefined : filter;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", tag ?? "all", 1, ""],
    queryFn: () =>
      fetchNotes({
        page: 1,
        perPage: 12,
        search: undefined,
        tag,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className={css.wrapper}>
        <NotesClient key={tag ?? "all"} tag={tag} />
      </div>
    </HydrationBoundary>
  );
}
