import React from "react";

function Pagination({ currentPage, totalPages, onPageChange }) {
    // Create an array of page numbers based on total pages
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="pagination">
            {/* "Previous" button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                className={`pagination-button ${currentPage === 1 ? 'disabled' : ''}`}
                disabled={currentPage === 1}
            >
                Previous
            </button>

            {/* Render individual page buttons */}
            {pageNumbers.map((pageNumber) => (
                <button
                    key={pageNumber}
                    onClick={() => onPageChange(pageNumber)}
                    className={`pagination-button ${currentPage === pageNumber ? 'active' : ''}`}
                >
                    {pageNumber}
                </button>
            ))}

            {/* "Next" button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                className={`pagination-button ${currentPage === totalPages ? 'disabled' : ''}`}
                disabled={currentPage === totalPages}
            >
                Next
            </button>
        </div>
    );
}

export default Pagination;
