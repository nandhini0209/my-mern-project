import { Breadcrumb } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function AppBreadcrumb({ items }) {
  return (
    <Breadcrumb className="mb-4">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <Breadcrumb.Item key={idx} active={isLast} linkAs={isLast ? undefined : Link} linkProps={isLast ? {} : { to: item.to }}>
            {item.label}
          </Breadcrumb.Item>
        );
      })}
    </Breadcrumb>
  );
}
