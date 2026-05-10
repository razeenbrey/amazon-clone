import './SignInModal.css';

function SignInModal({ open, onClose, onSubmit, user, onSignOut }) {
  if (!open) return null;

  function handleSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const name = String(fd.get('name') || '').trim() || 'Customer';
    const email = String(fd.get('email') || '').trim() || 'you@example.com';
    onSubmit({ name, email });
    onClose();
  }

  return (
    <div className="signin-overlay" role="presentation" onClick={onClose}>
      <div
        className="signin-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="signin-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="signin-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <h2 id="signin-title">Sign in</h2>
        <p className="signin-sub">
          This is a demo clone. Your details are stored only in this browser (local storage). No
          password is required.
        </p>
        {user ? (
          <div className="signin-signed">
            <p>
              Signed in as <strong>{user.name}</strong>
            </p>
            <p className="signin-email">{user.email}</p>
            <div className="signin-actions">
              <button type="button" className="btn-amazon-secondary" onClick={onClose}>
                Close
              </button>
              <button
                type="button"
                className="btn-amazon-outline"
                onClick={() => onSignOut?.()}
              >
                Sign out
              </button>
            </div>
          </div>
        ) : (
          <form className="signin-form" onSubmit={handleSubmit}>
            <label htmlFor="signin-name">Name</label>
            <input id="signin-name" name="name" type="text" autoComplete="name" placeholder="Your name" />
            <label htmlFor="signin-email">Email</label>
            <input id="signin-email" name="email" type="email" autoComplete="email" placeholder="Email" />
            <label htmlFor="signin-password">Password (ignored)</label>
            <input
              id="signin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Anything works"
            />
            <button type="submit" className="btn-amazon-yellow">
              Sign in
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default SignInModal;
