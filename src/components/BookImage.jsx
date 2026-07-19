import { useState } from 'react';
import { PLACEHOLDER_IMAGE } from '../services/seedData';

// Renders a book cover image with automatic fallback to a placeholder
// if the source URL fails to load (e.g. Open Library has no cover for that ISBN).
export default function BookImage({ src, alt, className, style }) {
  const [error, setError] = useState(false);

  return (
    <img
      src={error ? PLACEHOLDER_IMAGE : src}
      alt={alt}
      className={className}
      style={style}
      onError={() => setError(true)}
    />
  );
}
