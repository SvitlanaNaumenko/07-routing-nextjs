import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '../../services/noteService';
import type { CreateNoteDto } from '../../types/note';
import css from './NoteForm.module.css';

interface NoteFormProps {
  onSubmit: (values: CreateNoteDto) => void;
  onCancel: () => void;
  onSuccess?: () => void;
}

const validationSchema = Yup.object({
  title: Yup.string().min(3, 'Too Short!').max(50, 'Too Long!').required('Title is required'),
  content: Yup.string().max(500, 'Content must be at most 500 characters'),
  tag: Yup.string()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'], 'Invalid tag')
    .required('Tag is required'),
});

const initialValues: CreateNoteDto = {
  title: '',
  content: '',
  tag: 'Todo',
};

const NoteForm: React.FC<NoteFormProps> = ({ onCancel, onSuccess }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newNote: CreateNoteDto) => createNote(newNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      if (onSuccess) onSuccess();
    },
  });

  const handleSubmit = (values: CreateNoteDto, { resetForm }: { resetForm: () => void }) => {
    mutation.mutate(values, {
      onSuccess: () => {
        resetForm();
      },
    });
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form className={css.form}>
        <div className={css.fieldGroup}>
          <label htmlFor="title">Title</label>
          <Field id="title" name="title" type="text" className={css.input} />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.fieldGroup}>
          <label htmlFor="content">Content</label>
          <Field id="content" name="content" as="textarea" className={css.textarea} />
          <ErrorMessage name="content" component="span" className={css.error} />
        </div>

        <div className={css.fieldGroup}>
          <label htmlFor="tag">Tag</label>
          <Field id="tag" name="tag" as="select" className={css.select}>
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage name="tag" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button type="button" onClick={onCancel} className={css.cancelButton}>
            Cancel
          </button>

          <button type="submit" disabled={mutation.isPending} className={css.button}>
            {mutation.isPending ? 'Creating...' : 'Create note'}
          </button>
        </div>
      </Form>
    </Formik>
  );
};

export default NoteForm;
