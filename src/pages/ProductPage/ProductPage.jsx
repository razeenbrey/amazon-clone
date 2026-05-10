import { useParams, Navigate } from 'react-router-dom';
import Product from '../../components/Product/Product';
import './ProductPage.css';
import { useShop } from '../../context/ShopContext';

function ProductPage() {
  const { id } = useParams();
  const { getProduct } = useShop();
  const product = getProduct(id);

  if (!product) {
    return <Navigate to="/search" replace />;
  }

  return (
    <div className="product-page-wrapper">
      <Product product={product} />
    </div>
  );
}

export default ProductPage;
