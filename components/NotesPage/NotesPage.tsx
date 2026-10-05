'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchNotes } from '@/services/noteService';

export default function NotesPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['notes'],
    queryFn: () => fetchNotes(),
  });

  if (isLoading) return <p>Loading notes...</p>;
  if (isError) return <p>Loading error: {(error as Error).message}</p>;

  return (
    <main>
      <h1>Notes List</h1>
      {data?.notes && data.notes.length > 0 ? (
        <ul>
          {data.notes.map(note => (
            <li key={note.id}>
              <h3>{note.title}</h3>
              <p>{note.content}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No notes found</p>
      )}
    </main>
  );
}
