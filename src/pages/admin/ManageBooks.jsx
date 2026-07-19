import { useEffect, useState, useCallback } from 'react';
import { Container, Card, Button, Table, Modal, Form, Badge } from 'react-bootstrap';
import { PencilSquare, Trash, PlusCircle } from 'react-bootstrap-icons';
import { mockApi } from '../../services/mockApi';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';
import ConfirmDialog from '../../components/ConfirmDialog';
import BookImage from '../../components/BookImage';

const GENRES = ['Classic', 'Fiction', 'Dystopian', 'Romance', 'Fantasy', 'Adventure', 'Non-Fiction', 'Memoir', 'Self-Help', 'Post-Apocalyptic'];

const emptyForm = {
  title: '', author: '', genre: 'Fiction', description: '', isbn: '',
  publisher: '', language: 'English', price: '', stock: '', rating: 0, image: '',
};

export default function ManageBooks() {
  const { token } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    const data = await mockApi.getBooks({ limit: 1000 });
    setBooks(data.books);
    setLoading(false);
  }, []);

  useEffect(() => { fetchBooks(); }, [fetchBooks]);

  function openAdd() {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  }

  function openEdit(book) {
    setEditing(book._id);
    setForm({ ...book });
    setShowModal(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock), rating: Number(form.rating) };
      if (editing) {
        await mockApi.updateBook(editing, payload, token);
        toast.success('Book updated');
      } else {
        await mockApi.createBook(payload, token);
        toast.success('Book added');
      }
      setShowModal(false);
      fetchBooks();
    } catch (err) {
      toast.error(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    try {
      await mockApi.deleteBook(deleteTarget, token);
      toast.success('Book deleted');
      fetchBooks();
    } catch (err) {
      toast.error(err.message || 'Delete failed');
    } finally {
      setDeleteTarget(null);
    }
  }

  if (loading) return <LoadingSpinner />;

  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold mb-0">Manage Books</h1>
        <Button variant="primary" onClick={openAdd}><PlusCircle className="me-2" />Add Book</Button>
      </div>

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Genre</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book._id}>
                    <td><BookImage src={book.image} alt={book.title} style={{ width: 40, height: 50, objectFit: 'cover' }} className="rounded" /></td>
                    <td className="fw-semibold">{book.title}</td>
                    <td>{book.author}</td>
                    <td><Badge bg="light" text="dark">{book.genre}</Badge></td>
                    <td>${book.price.toFixed(2)}</td>
                    <td>{book.stock}</td>
                    <td>{book.rating?.toFixed(1)}</td>
                    <td>
                      <Button variant="link" size="sm" className="text-primary p-1" onClick={() => openEdit(book)}><PencilSquare /></Button>
                      <Button variant="link" size="sm" className="text-danger p-1" onClick={() => setDeleteTarget(book._id)}><Trash /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{editing ? 'Edit Book' : 'Add New Book'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSave}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Author</Form.Label>
              <Form.Control value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            </Form.Group>
            <div className="row g-3">
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label>Genre</Form.Label>
                  <Form.Select value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })}>
                    {GENRES.map((g) => <option key={g}>{g}</option>)}
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label>ISBN</Form.Label>
                  <Form.Control value={form.isbn} onChange={(e) => setForm({ ...form, isbn: e.target.value })} required />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label>Publisher</Form.Label>
                  <Form.Control value={form.publisher} onChange={(e) => setForm({ ...form, publisher: e.target.value })} required />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label>Language</Form.Label>
                  <Form.Control value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} required />
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group>
                  <Form.Label>Price ($)</Form.Label>
                  <Form.Control type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group>
                  <Form.Label>Stock</Form.Label>
                  <Form.Control type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group>
                  <Form.Label>Rating (0-5)</Form.Label>
                  <Form.Control type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />
                </Form.Group>
              </div>
            </div>
            <Form.Group className="mt-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." required />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={saving}>{saving ? 'Saving...' : 'Save Book'}</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <ConfirmDialog
        show={!!deleteTarget}
        title="Delete Book"
        message="Are you sure you want to delete this book? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        confirmText="Delete"
      />
    </Container>
  );
}
