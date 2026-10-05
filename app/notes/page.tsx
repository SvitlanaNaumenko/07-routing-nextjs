import { QueryClient, HydrationBoundary, dehydrate } from '@tanstack/react-query';
import NotesClient from '@/components/NotesPage/NotesPage';
import { fetchNotes } from '@/services/noteService'; // <- змінили getNotes на fetchNotes

export default async function NotesPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes'],
    queryFn: () => fetchNotes(), // <- використовуємо fetchNotes
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient />
    </HydrationBoundary>
  );
}
