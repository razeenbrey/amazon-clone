import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Product.css';
import { useShop } from '../../context/ShopContext';

function Product({ product }) {
  const navigate = useNavigate();
  const { addToCart, buyNow } = useShop();
  const [qty, setQty] = useState(1);
  const stock = Math.max(0, Number(product.quantity) || 0);
  const maxBuy = stock;
  const safeQty = maxBuy === 0 ? 0 : Math.min(Math.max(1, qty), maxBuy);

  function handleAddCart() {
    if (!safeQty) return;
    const r = addToCart(product.id, safeQty);
    if (!r.ok) alert('Unable to update cart for this quantity.');
  }

  function handleBuyNow() {
    if (!safeQty) return;
    const r = buyNow(product.id, safeQty);
    if (!r.ok) alert('Purchase could not complete (stock).');
    else navigate('/orders/thanks');
  }

  return (
    <div className="product-page-inner page-inner">
      <div className="product-columns">
        <div className="product-gallery amazon-card">
          <img src={product.picUrl} alt="" className="product-hero-img" />
        </div>

        <div className="product-copy">
          <h1 className="product-heading">{product.name}</h1>
          <div className="divider-soft" />

          <div className="buy-panel amazon-card">
            <div className="buy-price-row">
              <span className="buy-price">${product.price.toFixed(2)}</span>
            </div>
            <p className="buy-delivery-text">
              ${Number(product.deliverCost || 0).toFixed(2)} delivery if applicable ·{' '}
              <strong>{product.deliverDate}</strong>
            </p>

            <div className="delivery-pill">
              <span className="material-symbols-outlined pill-icon">location_on</span>
              <span>Deliver to South Africa</span>
            </div>

            <div className="stock-row">
              {product.inStockDisplay ? (
                <span className="stock-ok">In Stock</span>
              ) : (
                <span className="stock-bad">Currently unavailable</span>
              )}
            </div>

            <label htmlFor={`qty-main-${product.id}`} className="qty-label">
              Qty:
            </label>
            <select
              id={`qty-main-${product.id}`}
              className="qty-select"
              value={maxBuy === 0 ? 0 : safeQty}
              disabled={!product.inStockDisplay || maxBuy === 0}
              onChange={(e) => setQty(Number(e.target.value))}
            >
              {maxBuy === 0 ? (
                <option value={0}>0</option>
              ) : (
                Array.from({ length: maxBuy }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))
              )}
            </select>

            <button
              type="button"
              className="btn-amazon-yellow btn-block"
              disabled={!product.inStockDisplay}
              onClick={handleAddCart}
            >
              Add to Cart
            </button>
            <button
              type="button"
              className="btn-amazon-accent btn-block"
              disabled={!product.inStockDisplay}
              onClick={handleBuyNow}
            >
              Buy Now
            </button>

            <p className="secure-note">
              Secure transaction — demo only; purchases update stock in local storage on this device.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;
