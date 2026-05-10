import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import './Search.css';
import SearchProduct from '../../components/SearchProduct/SearchProduct';
import { useShop } from '../../context/ShopContext';

function Search() {
  const [searchParams] = useSearchParams();
  const q = (searchParams.get('q') || '').trim().toLowerCase();
  const { products } = useShop();
  const [sort, setSort] = useState('price-asc');

  const filtered = useMemo(() => {
    let list = products.slice();
    if (q) {
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }
    switch (sort) {
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        list.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
      default:
        list.sort((a, b) => a.price - b.price);
        break;
    }
    return list;
  }, [products, q, sort]);

  return (
    <div className="search-shell">
      <aside className="filters amazon-card">
        <h2 className="filters-title">Sort &amp; filter</h2>
        <fieldset className="filter-fieldset">
          <legend>Sort results</legend>
          <div className="search-radio-group">
            {[
              ['price-asc', 'Price: Low to High'],
              ['price-desc', 'Price: High to Low'],
              ['name-asc', 'Name: A-Z'],
              ['name-desc', 'Name: Z-A'],
            ].map(([value, label]) => (
              <label key={value} className="radio-row">
                <input
                  type="radio"
                  name="search-sort"
                  value={value}
                  checked={sort === value}
                  onChange={() => setSort(value)}
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
        <p className="filter-hint">Showing local catalog ({products.length} items).</p>
      </aside>

      <div className="search-main">
        <header className="search-header">
          <h1 className="results-title">{q ? `Results for “${searchParams.get('q')}”` : 'Shop all products'}</h1>
          <p className="results-sub">
            {filtered.length} result{filtered.length === 1 ? '' : 's'}. Tap a tile for product details or add to cart.
          </p>
        </header>

        <div className="products-grid">
          {filtered.map((p) => (
            <SearchProduct key={p.id} product={p} />
          ))}
        </div>

        {!filtered.length ? (
          <p className="no-results">
            Nothing matched that query.{' '}
            <Link className="amazon-text-link-inline" to="/search">
              Clear search
            </Link>
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default Search;
