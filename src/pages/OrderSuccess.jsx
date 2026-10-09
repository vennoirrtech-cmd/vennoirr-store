import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function OrderSuccess() {
  const { state } = useLocation();
  const orderNumber = state?.orderNumber || '—';
  const items = state?.items || [];

  return (
    <div className="order-success-page">
      <Helmet>
        <title>Order Confirmed | Vennoirr</title>
      </Helmet>

      <div className="order-success-card">
        <div className="success-icon-wrap">
          <div className="success-icon">✓</div>
        </div>

        <h1 className="success-title">Order Confirmed!</h1>
        <p className="success-subtitle">Thank you for shopping with Vennoirr 🎉</p>

        {orderNumber !== '—' && (
          <p className="success-order-num">Order #{orderNumber}</p>
        )}

        {items.length > 0 && (
          <div className="success-items">
            {items.map((item, idx) => (
              <div key={idx} className="success-item-row">
                <span>{item.title || item.name || 'Product'} × {item.qty}</span>
                <span>₹{item.price * item.qty}</span>
              </div>
            ))}
          </div>
        )}

        <div className="success-eta">
          🚚 Expected delivery: <strong>3–5 business days</strong>
        </div>

        <div className="success-actions">
          <Link to="/account" className="shop-btn" style={{ marginRight: '16px' }}>
            VIEW ORDERS
          </Link>
          <Link to="/" className="shop-btn shop-btn--outline">
            CONTINUE SHOPPING
          </Link>
        </div>
      </div>
    </div>
  );
}
