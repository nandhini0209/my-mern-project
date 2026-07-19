import { Pagination } from 'react-bootstrap';

export default function AppPagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const items = [];
  const maxVisible = 5;
  let start = Math.max(1, page - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);

  items.push(<Pagination.First key="first" disabled={page === 1} onClick={() => onPageChange(1)} />);
  items.push(<Pagination.Prev key="prev" disabled={page === 1} onClick={() => onPageChange(page - 1)} />);

  for (let i = start; i <= end; i++) {
    items.push(
      <Pagination.Item key={i} active={i === page} onClick={() => onPageChange(i)}>
        {i}
      </Pagination.Item>
    );
  }

  items.push(<Pagination.Next key="next" disabled={page === totalPages} onClick={() => onPageChange(page + 1)} />);
  items.push(<Pagination.Last key="last" disabled={page === totalPages} onClick={() => onPageChange(totalPages)} />);

  return (
    <div className="d-flex justify-content-center mt-4">
      <Pagination>{items}</Pagination>
    </div>
  );
}
