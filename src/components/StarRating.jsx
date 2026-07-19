import { StarFill, StarHalf, Star } from 'react-bootstrap-icons';

export default function StarRating({ rating, size = 16 }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) stars.push(<StarFill key={i} className="text-warning" size={size} />);
    else if (rating >= i - 0.5) stars.push(<StarHalf key={i} className="text-warning" size={size} />);
    else stars.push(<Star key={i} className="text-warning" size={size} />);
  }
  return <div className="d-flex gap-1">{stars}</div>;
}
