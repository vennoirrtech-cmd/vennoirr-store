import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function NotFound() {
  return (
    <div className="not-found-page">
      <Helmet>
        <title>404 — Page Not Found | Vennoirr</title>
      </Helmet>
      <div className="not-found-card">
        <h1 className="not-found-code">404</h1>
        <p className="not-found-msg">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link to="/" className="shop-btn">BACK TO HOME</Link>
      </div>
    </div>
  );
}
