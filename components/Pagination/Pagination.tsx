"use client";

import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <ReactPaginate
      pageCount={totalPages}
      forcePage={page - 1}
      onPageChange={(e) => onPageChange(e.selected + 1)}
      previousLabel="Prev"
      nextLabel="Next"
      breakLabel="..."
      containerClassName={css.pagination}
      activeClassName={css.active}
      pageClassName={css.page}
      previousClassName={css.prev}
      nextClassName={css.next}
      disabledClassName={css.disabled}
      breakClassName={css.break}
    />
  );
}
