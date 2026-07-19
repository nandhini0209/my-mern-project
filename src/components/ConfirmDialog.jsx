import { Modal, Button } from 'react-bootstrap';

export default function ConfirmDialog({ show, title, message, onConfirm, onCancel, confirmText = 'Confirm', confirmVariant = 'danger' }) {
  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button variant={confirmVariant} onClick={onConfirm}>{confirmText}</Button>
      </Modal.Footer>
    </Modal>
  );
}
