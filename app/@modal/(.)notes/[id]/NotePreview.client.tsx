'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { fetchNoteById } from '@/services/noteService'; // Перевірте шлях до вашого сервісу
import Modal from '@/components/Modal/Modal'; // Перевірте шлях до вашого компонента Modal

interface NotePreviewClientProps {
  id: string;
}

export default function NotePreviewClient({ id }: NotePreviewClientProps) {
  const router = useRouter();

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  const handleClose = () => {
    router.back(); // Повертає на попередній маршрут без перезавантаження сторінки
  };

  return (
    <Modal isOpen={true} onClose={handleClose}>
      {isLoading && <p>Завантаження...</p>}
      {isError && <p>Помилка завантаження нотатки.</p>}
      {note && (
        <div>
          <h2>{note.title}</h2>
          <p>{note.content}</p>
        </div>
      )}
    </Modal>
  );
}
