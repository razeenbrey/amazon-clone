import { Link, useNavigate } from 'react-router-dom';
import './SearchProduct.css';
import { useShop } from '../../context/ShopContext';

function SearchProduct({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useShop();

  function handleCartClick(e) {
    e.preventDefault();
    e.stopPropagation();
    const r = addToCart(product.id, 1);
    if (!r.ok) {
      alert('Cannot add more — out of stock or max quantity reached.');
    }
  }

  return (
    <div className="search-product-card amazon-card">
      <Link className="search-product-link" to={`/product/${product.id}`}>
        <div className="search-product-img-wrap">
          <img src={product.picUrl} alt="" className="search-product-img" />
        </div>
        <span className="search-product-name">{product.name}</span>
        <span className="search-product-price">${product.price.toFixed(2)}</span>
        <span className="search-product-delivery">
          ${Number(product.deliverCost || 0).toFixed(2)} delivery · <b>{product.deliverDate}</b>
        </span>
      </Link>
      <button
        type="button"
        className="btn-amazon-yellow btn-full"
        disabled={!product.inStockDisplay}
        onClick={handleCartClick}
      >
        Add to cart
      </button>
      <button
        type="button"
        className="amazon-text-link btn-text-only"
        onClick={() => navigate(`/product/${product.id}`)}
      >
        Details
      </button>
    </div>
  );
}

export default SearchProduct;
