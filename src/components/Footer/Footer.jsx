import { Link } from 'react-router-dom';
import './Footer.css';
import { useUi } from '../../context/UiContext';

function Footer() {
  const { openSignIn } = useUi();

  function backToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <footer className="site-footer">
      <button type="button" className="back-to-top" onClick={backToTop}>
        Back to top
      </button>

      <div className="sign-in-footer-strip">
        <span className="footer-prompt-title">See personalized recommendations</span>
        <button type="button" className="btn-amazon-yellow btn-compact" onClick={() => openSignIn()}>
          Sign in
        </button>
        <div className="footer-new-customer">
          <span className="caption">New customer?</span>
          <button type="button" className="amazon-inline-link" onClick={() => openSignIn()}>
            Start here.
          </button>
        </div>
      </div>

      <div className="footer-legal amazon-dark-panel">
        <div className="footer-links-row">
          <Link to="/" onClick={backToTop}>
            Home
          </Link>
          <Link to="/search">Shop all</Link>
          <Link to="/orders">Orders</Link>
          <Link to="/cart">Cart</Link>
        </div>
        <p className="footer-copy">
          Amazon clone demo — Conditions of Use · Privacy Notice (static)
        </p>
      </div>
    </footer>
  );
}

export default Footer;
