"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import React from "react";

interface TableColumn {
  key: string;
  label: string;
  render?: (data: any) => JSX.Element | string; // Optional custom render function
}

interface DataTableProps {
  data: any[];
  columns: TableColumn[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  pageSize: number;
}

export const DataTable: React.FC<DataTableProps> = ({
  data,
  columns,
  currentPage,
  totalPages,
  totalCount,
  onPageChange,
  pageSize,
}) => {
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (pageNumber: number) => {
    onPageChange(pageNumber);
  };

  const renderPageNumbers = () => {
    const pages: JSX.Element[] = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            onClick={() => handlePageClick(i)}
            className={currentPage === i ? "active" : ""}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    return pages;
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key}>{column.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              {columns.map((column) => (
                <TableCell key={column.key}>
                  {column.render
                    ? column.render(row[column.key])
                    : row[column.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
        <TableCaption>
          <Pagination className="flex items-end justify-between">
            <div>
              Showing {currentPage}-{totalPages} of {totalCount}
            </div>
            <PaginationContent className="bg-slate-50 mt-2 w-fit border rounded-xl">
              <PaginationItem>
                <PaginationPrevious href="#" onClick={handlePreviousPage} />
              </PaginationItem>
              {renderPageNumbers()}
              {totalPages > 5 && <PaginationEllipsis />}
              <PaginationItem>
                <PaginationNext href="#" onClick={handleNextPage} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </TableCaption>
      </Table>
    </div>
  );
};
