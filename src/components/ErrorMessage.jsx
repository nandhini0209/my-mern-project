import { Alert } from 'react-bootstrap';

export default function ErrorMessage({ message, onDismiss }) {
  if (!message) return null;
  return (
    <Alert variant="danger" dismissible onClose={onDismiss} className="mb-3">
      {message}
    </Alert>
  );
}
