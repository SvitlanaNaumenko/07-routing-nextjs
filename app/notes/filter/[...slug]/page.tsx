import { QueryClient, HydrationBoundary, dehydrate } from '@tanstack/react-query';
import NotesClient from './Notes.client';
import { fetchNotes } from '@/services/noteService';

interface PageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

export default async function NotesPage({ params }: PageProps) {
  const resolvedParams = await params;

  // Отримуємо значення тегу з параметра slug
  const tag = resolvedParams.slug?.[0] || 'all';

  const queryClient = new QueryClient();

  // Виконуємо prefetchQuery із зазначенням тегу в queryKey та queryFn
  await queryClient.prefetchQuery({
    queryKey: ['notes', { tag }],
    queryFn: () => fetchNotes({ tag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
