'use client';

import React from 'react';
import Link from 'next/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import css from './NoteList.module.css';
import { Note } from '@/lib/api'; // або '@/types/note' залежно від вашого імпорту
import { deleteNote } from '@/services/noteService';

export interface NoteListProps {
  notes: Note[];
}

const NoteList: React.FC<NoteListProps> = ({ notes }) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  return (
    <ul className={css.list}>
      {notes.map(note => (
        <li key={note.id} className={css.item}>
          <h3 className={css.title}>{note.title}</h3>
          <p className={css.content}>{note.content}</p>

          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>

            <div className={css.actions}>
              <Link href={`/notes/${note.id}`} className={css.link}>
                View details
              </Link>

              <button
                type="button"
                className={css.button}
                disabled={deleteMutation.isPending}
                onClick={() => deleteMutation.mutate(note.id)}
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default NoteList;
