import React from 'react';
import ReactPaginate from 'react-paginate';
import css from './Pagination.module.css';

interface PaginationProps {
  pageCount: number;
  currentPage: number;
  onPageChange: (selectedItem: { selected: number }) => void;
}

const Pagination: React.FC<PaginationProps> = ({ pageCount, currentPage, onPageChange }) => {
  if (pageCount <= 1) {
    return null;
  }

  return (
    <ReactPaginate
      pageCount={pageCount}
      forcePage={currentPage - 1} // react-paginate починає відлік сторінок з 0
      onPageChange={onPageChange}
      containerClassName={css.pagination}
      previousLabel="<"
      nextLabel=">"
    />
  );
};

export default Pagination;
