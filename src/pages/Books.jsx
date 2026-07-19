import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, Offcanvas } from 'react-bootstrap';
import { Funnel, X } from 'react-bootstrap-icons';
import { mockApi } from '../services/mockApi';
import BookCard from '../components/BookCard';
import LoadingSpinner from '../components/LoadingSpinner';
import AppPagination from '../components/AppPagination';
import AppBreadcrumb from '../components/AppBreadcrumb';
import ErrorMessage from '../components/ErrorMessage';

const GENRES = ['All', 'Classic', 'Fiction', 'Dystopian', 'Romance', 'Fantasy', 'Adventure', 'Non-Fiction', 'Memoir', 'Self-Help', 'Post-Apocalyptic'];
const SORTS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

export default function Books() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    genre: searchParams.get('genre') || 'All',
    minPrice: '',
    maxPrice: '',
    minRating: '',
    sort: searchParams.get('sort') || 'newest',
  });

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { ...filters, page, limit: 9 };
      if (params.minPrice === '') delete params.minPrice;
      if (params.maxPrice === '') delete params.maxPrice;
      if (params.minRating === '') delete params.minRating;
      const data = await mockApi.getBooks(params);
      setBooks(data.books);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch (err) {
      setError(err.message || 'Failed to load books');
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => { fetchBooks(); }, [fetchBooks]);

  function handleFilterChange(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  }

  function clearFilters() {
    setFilters({ search: '', genre: 'All', minPrice: '', maxPrice: '', minRating: '', sort: 'newest' });
    setSearchParams({});
    setPage(1);
  }

  const FilterPanel = () => (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold mb-0">Filters</h5>
        <Button variant="link" size="sm" className="text-decoration-none p-0" onClick={clearFilters}>
          <X /> Clear All
        </Button>
      </div>

      <Form.Group className="mb-3">
        <Form.Label className="fw-semibold small">Genre</Form.Label>
        <Form.Select value={filters.genre} onChange={(e) => handleFilterChange('genre', e.target.value)}>
          {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label className="fw-semibold small">Price Range</Form.Label>
        <div className="d-flex gap-2">
          <Form.Control type="number" placeholder="Min" value={filters.minPrice} onChange={(e) => handleFilterChange('minPrice', e.target.value)} />
          <Form.Control type="number" placeholder="Max" value={filters.maxPrice} onChange={(e) => handleFilterChange('maxPrice', e.target.value)} />
        </div>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label className="fw-semibold small">Minimum Rating</Form.Label>
        <Form.Select value={filters.minRating} onChange={(e) => handleFilterChange('minRating', e.target.value)}>
          <option value="">Any</option>
          <option value="3">3.0 & up</option>
          <option value="4">4.0 & up</option>
          <option value="4.5">4.5 & up</option>
        </Form.Select>
      </Form.Group>
    </div>
  );

  return (
    <Container className="py-4">
      <AppBreadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Books' }]} />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold mb-0">Book Catalog</h1>
          <p className="text-muted">{total} {total === 1 ? 'book' : 'books'} found</p>
        </div>
        <div className="d-flex gap-2">
          <Form.Select value={filters.sort} onChange={(e) => handleFilterChange('sort', e.target.value)} style={{ width: 'auto' }}>
            {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </Form.Select>
          <Button variant="outline-primary" className="d-lg-none" onClick={() => setShowFilters(true)}>
            <Funnel /> Filters
          </Button>
        </div>
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

      <Row className="g-4">
        <Col lg={3} className="d-none d-lg-block">
          <Card className="border-0 shadow-sm p-3 sticky-top" style={{ top: '80px' }}>
            <FilterPanel />
          </Card>
        </Col>

        <Col lg={9}>
          {loading ? (
            <LoadingSpinner />
          ) : books.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">No books found matching your filters.</p>
              <Button variant="primary" onClick={clearFilters}>Clear Filters</Button>
            </div>
          ) : (
            <>
              <Row xs={1} sm={2} md={3} className="g-4">
                {books.map((book) => (
                  <Col key={book._id}><BookCard book={book} /></Col>
                ))}
              </Row>
              <AppPagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </>
          )}
        </Col>
      </Row>

      <Offcanvas show={showFilters} onHide={() => setShowFilters(false)} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Filters</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <FilterPanel />
        </Offcanvas.Body>
      </Offcanvas>
    </Container>
  );
}
