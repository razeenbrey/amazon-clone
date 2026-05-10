import { Link } from 'react-router-dom';
import './OrderThanks.css';

function OrderThanks() {
  return (
    <div className="page-inner thanks-page">
      <div className="thanks-card amazon-card">
        <h1>Thank you for your order</h1>
        <p>This is a local demo — your cart was cleared and inventory was updated in this browser.</p>
        <div className="thanks-actions">
          <Link className="btn-amazon-yellow" to="/">
            Continue shopping
          </Link>
          <Link className="amazon-text-link-inline" to="/search">
            View more deals
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderThanks;
