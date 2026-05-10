import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../../assets/logo.png';
import { useShop } from '../../context/ShopContext';
import { useUi } from '../../context/UiContext';

function Navbar() {
  const navigate = useNavigate();
  const { user, cartCount } = useShop();
  const { openSignIn } = useUi();
  const [query, setQuery] = useState('');

  function runSearch(e) {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : '/search');
  }

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <>
      <nav className="nav-belt" aria-label="Primary">
        <div className="nav-belt-top">
          <button type="button" className="nav-mobile-toggle" aria-label="Open menu">
            <span className="material-symbols-outlined">menu</span>
          </button>

          <div className="nav-left">
            <Link to="/" className="logo-link header-button" onClick={scrollTop}>
              <img src={logo} alt="Amazon home" className="logo-img" />
            </Link>

            <button type="button" className="location header-button plain-btn">
              <span className="material-symbols-outlined location-pin">location_on</span>
              <div className="location-info">
                <span className="loc reg-text">Deliver to</span>
                <span className="bold-text">South Africa</span>
              </div>
            </button>
          </div>

          <form className="nav-center" onSubmit={runSearch} role="search">
            <label htmlFor="search-category" className="visually-hidden">
              Category
            </label>
            <select
              id="search-category"
              name="category"
              className="dropdown"
              aria-label="Search in"
              defaultValue="all"
            >
              <option value="all">All</option>
              <option value="electronics">Electronics</option>
              <option value="home">Home</option>
              <option value="books">Books</option>
              <option value="deals">Deals</option>
            </select>
            <input
              type="text"
              className="search-bar"
              placeholder="Search Amazon"
              aria-label="Search Amazon"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="search-button" aria-label="Submit search">
              <span className="material-symbols-outlined">search</span>
            </button>
          </form>

          <div className="nav-right">
            <button
              type="button"
              id="accounts"
              className="header-button plain-btn accounts-btn"
              onClick={() => openSignIn()}
            >
              <span className="reg-text">
                {user ? `Hello, ${user.name.split(' ')[0]}` : 'Hello, sign in'}
              </span>
              <span className="bold-text">Account &amp; Lists</span>
            </button>

            <button
              type="button"
              className="header-button plain-btn"
              onClick={() => navigate('/orders')}
            >
              <span className="reg-text">Returns</span>
              <span className="bold-text">&amp; Orders</span>
            </button>

            <Link to="/cart" className="header-button basket-link" onClick={scrollTop}>
              <div className="basket-wrap">
                <span className="material-symbols-outlined cart-icon">shopping_cart</span>
                {cartCount > 0 ? <span className="cart-badge">{cartCount}</span> : null}
              </div>
              <span className="bold-text">Cart</span>
            </Link>
          </div>
        </div>

        <div className="nav-belt-bottom" role="navigation" aria-label="Shortcut links">
          <button type="button" className="nav-butt all-dept">
            <span className="material-symbols-outlined">menu</span>
            All
          </button>
          <button type="button" className="nav-butt">
            Today&apos;s Deals
          </button>
          <button type="button" className="nav-butt">
            Customer Service
          </button>
          <button type="button" className="nav-butt">
            Registry
          </button>
          <button type="button" className="nav-butt">
            Gift Cards
          </button>
          <button type="button" className="nav-butt">
            Sell
          </button>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
