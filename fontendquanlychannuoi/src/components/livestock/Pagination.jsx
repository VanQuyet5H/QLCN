import './Pagination.css';

function Pagination({ itemsPerPage, totalItems, currentPage, onPageChange }) {
  const pageNumbers = [];
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Tạo mảng số trang
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Hiển thị giới hạn số trang
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  return (
    <div className="pagination">
      <button
        className="pagination-button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Trước
      </button>

      {getPageNumbers().map((number, index) => (
        <button
          key={index}
          className={`pagination-button ${number === currentPage ? 'active' : ''} ${number === '...' ? 'dots' : ''}`}
          onClick={() => number !== '...' && onPageChange(number)}
          disabled={number === '...'}
        >
          {number}
        </button>
      ))}

      <button
        className="pagination-button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Sau
      </button>
    </div>
  );
}

export default Pagination;