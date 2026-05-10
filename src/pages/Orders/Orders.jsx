import { Link } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import './Orders.css';

function Orders() {
  const { orders } = useShop();

  if (!orders.length) {
    return (
      <div className="page-inner orders-page">
        <h1 className="page-title">Your Orders</h1>
        <p className="orders-empty">
          You have not placed any orders in this browser yet.
        </p>
        <Link to="/search" className="btn-amazon-yellow">
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="page-inner orders-page">
      <h1 className="page-title">Your Orders</h1>
      <ul className="orders-list">
        {orders.map((o) => (
          <li key={o.id} className="order-card amazon-card">
            <div className="order-head">
              <div>
                <span className="order-id-label">ORDER #</span>
                <span className="order-id">{o.id}</span>
              </div>
              <div className="order-date">
                {new Date(o.createdAt).toLocaleString()}
              </div>
              <div className="order-total">
                Total: <strong>${o.total.toFixed(2)}</strong>
              </div>
            </div>
            <ul className="order-items">
              {o.items.map((item) => (
                <li key={`${o.id}-${item.productId}`} className="order-item">
                  <Link to={`/product/${item.productId}`}>{item.name}</Link>
                  <span className="order-item-meta">
                    × {item.quantity} · ${item.unitPrice.toFixed(2)} each
                  </span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Orders;
