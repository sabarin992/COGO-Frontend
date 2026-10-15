
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";


const Pagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  itemLabel = "items",
}) => {
  // Calculate the total number of pages.
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Calculate the record range displayed on the current page.
  const startItem =
    totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;

  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Move to the previous page without going below page 1.
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  // Move to the next page without exceeding the final page.
  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Don't render pagination for an empty result set or a single page.
  if (totalPages <= 1) {
    return (
      <div className="px-6 py-5 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          Showing {startItem} to {endItem} of {totalItems} {itemLabel}
        </p>
      </div>
    );
  }

  return (
    <div className="px-6 py-5 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Display the range of records currently shown. */}
      <p className="text-sm text-gray-500">
        Showing {startItem} to {endItem} of {totalItems} {itemLabel}
      </p>

      {/* Pagination navigation controls. */}
      <nav
        aria-label="Pagination"
        className="flex items-center gap-2"
      >
        {/* Previous page button. */}
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentPage === 1}
          aria-label="Previous page"
          className="p-2 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-[18px] h-[18px] text-gray-600" />
        </button>

        {/* Numbered page buttons. */}
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (page) => (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              disabled={currentPage === page}
              aria-label={`Page ${page}`}
              aria-current={currentPage === page ? "page" : undefined}
              className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                currentPage === page
                  ? "bg-black text-white cursor-default"
                  : "border border-gray-200 hover:bg-gray-100 text-gray-600 cursor-pointer"
              }`}
            >
              {page}
            </button>
          ),
        )}

        {/* Next page button. */}
        <button
          type="button"
          onClick={handleNext}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          className="p-2 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-[18px] h-[18px] text-gray-600" />
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
