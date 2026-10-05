'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import css from './Notes.module.css';
import NoteList from '../../components/NoteList/NoteList';
import SearchBox from '../../components/SearchBox/SearchBox';
import Pagination from '../../components/Pagination/Pagination';
import Modal from '../../components/Modal/Modal';
import NoteForm from '../../components/NoteForm/NoteForm';
import { fetchNotes, createNote } from '../../services/noteService';
import type { CreateNoteDto } from '../../types/note';

export function NotesClient() {
  const queryClient = useQueryClient();

  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const debouncedSetSearch = useDebouncedCallback((value: string) => {
    setSearchQuery(value);
    setPage(1);
  }, 300);

  const handleSearchChange = (value: string) => {
    setInputValue(value);
    debouncedSetSearch(value);
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', searchQuery, page],
    queryFn: () => fetchNotes({ page, perPage: 12, search: searchQuery }),
    placeholderData: keepPreviousData,
  });

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setIsModalOpen(false);
    },
  });

  const handleCreateNote = (noteData: CreateNoteDto) => {
    createMutation.mutate(noteData);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={inputValue} onChange={handleSearchChange} />

        {data && data.totalPages > 1 && (
          <Pagination
            pageCount={data.totalPages}
            currentPage={page}
            onPageChange={({ selected }: { selected: number }) => setPage(selected + 1)}
          />
        )}

        <button className={css.button} onClick={() => setIsModalOpen(true)} type="button">
          Create note +
        </button>
      </header>

      {isLoading && <p>Loading notes...</p>}
      {isError && <p>Error loading notes. Please try again.</p>}

      {data && <NoteList notes={data.notes} />}

      {/* Умовний рендеринг модалки */}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <NoteForm onSubmit={handleCreateNote} onCancel={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
