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
