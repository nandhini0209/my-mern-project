import { Spinner } from 'react-bootstrap';

export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <Spinner animation="border" role="status" variant="primary" />
      <p className="mt-3 text-muted">{message}</p>
    </div>
  );
}
