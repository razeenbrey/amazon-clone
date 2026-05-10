import { useNavigate } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import './Cart.css';

function Cart() {
  const navigate = useNavigate();
  const {
    cart,
    getProduct,
    updateCartLine,
    removeFromCart,
    checkoutCart,
    cartTotal,
  } = useShop();

  let shippingEstimate = 0;
  cart.forEach((line) => {
    const p = getProduct(line.productId);
    if (p) shippingEstimate += (p.deliverCost || 0) * line.quantity;
  });

  function handleCheckout() {
    const r = checkoutCart();
    if (r.ok) {
      navigate('/orders/thanks');
      return;
    }
    alert(
      r.reason === 'empty'
        ? 'Your cart is empty.'
        : `Could not place order (${String(r.reason)}).`
    );
  }

  if (!cart.length) {
    return (
      <div className="page-inner cart-page">
        <h1 className="page-title">Shopping Cart</h1>
        <p className="cart-empty">Your Amazon Cart is empty.</p>
        <button
          type="button"
          className="btn-amazon-yellow"
          onClick={() => navigate('/search')}
        >
          Continue shopping
        </button>
      </div>
    );
  }

  return (
    <div className="page-inner cart-page">
      <h1 className="page-title">Shopping Cart</h1>
      <div className="cart-layout">
        <div className="cart-lines amazon-card">
          {cart.map((line) => {
            const p = getProduct(line.productId);
            if (!p) return null;
            return (
              <div key={line.productId} className="cart-line">
                <button
                  type="button"
                  className="cart-line-img-wrap"
                  onClick={() => navigate(`/product/${p.id}`)}
                >
                  <img src={p.picUrl} alt="" className="cart-line-img" />
                </button>
                <div className="cart-line-body">
                  <button
                    type="button"
                    className="cart-line-title amazon-link-btn"
                    onClick={() => navigate(`/product/${p.id}`)}
                  >
                    {p.name}
                  </button>
                  <div className="cart-line-stock">
                    {p.quantity > 0 ? (
                      <span className="in-stock-label">In Stock</span>
                    ) : (
                      <span className="out-stock-label">Unavailable</span>
                    )}
                  </div>
                  <div className="cart-line-controls">
                    <label htmlFor={`qty-${line.productId}`}>Qty</label>
                    <select
                      id={`qty-${line.productId}`}
                      disabled={p.quantity <= 0}
                      value={
                        p.quantity <= 0
                          ? line.quantity
                          : Math.min(line.quantity, p.quantity)
                      }
                      onChange={(e) =>
                        updateCartLine(line.productId, Number(e.target.value))
                      }
                    >
                      {p.quantity <= 0 ? (
                        <option value={line.quantity}>{line.quantity}</option>
                      ) : (
                        Array.from({ length: p.quantity }, (_, i) => i + 1).map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))
                      )}
                    </select>
                    <button
                      type="button"
                      className="amazon-text-link"
                      onClick={() => removeFromCart(line.productId)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="cart-line-price">${p.price.toFixed(2)}</div>
              </div>
            );
          })}
        </div>
        <aside className="cart-summary amazon-card">
          <div className="cart-summary-inner">
            <p className="cart-summary-green">
              {shippingEstimate === 0
                ? 'Your order qualifies for FREE delivery.'
                : `Estimated delivery: $${shippingEstimate.toFixed(2)}`}
            </p>
            <p className="cart-subtotal">
              Subtotal ({cart.reduce((n, l) => n + l.quantity, 0)} items):{' '}
              <strong>${cartTotal.toFixed(2)}</strong>
            </p>
            <button type="button" className="btn-amazon-yellow" onClick={handleCheckout}>
              Proceed to checkout
            </button>
            <p className="cart-mini-hint">Demo checkout adjusts stock locally in your browser.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Cart;
