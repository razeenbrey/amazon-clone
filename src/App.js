import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import MainLayout from './layout/MainLayout';
import Home from './pages/Home/Home';
import Search from './pages/Search/Search';
import ProductPage from './pages/ProductPage/ProductPage';
import Cart from './pages/Cart/Cart';
import Orders from './pages/Orders/Orders';
import OrderThanks from './pages/OrderThanks/OrderThanks';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="search" element={<Search />} />
        <Route path="product/:id" element={<ProductPage />} />
        <Route path="cart" element={<Cart />} />
        <Route path="orders" element={<Orders />} />
        <Route path="orders/thanks" element={<OrderThanks />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
