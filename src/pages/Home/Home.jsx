import { Link } from 'react-router-dom';
import heroImg from '../../assets/hero.jpg';
import './Home.css';

function SearchNavCard({ title, subtitle, hint, ariaLabel }) {
  return (
    <Link className={`home-card amazon-card grid-item ${subtitle ? 'quad' : 'single'}`} to="/search" aria-label={ariaLabel}>
      <span className="grid-title">{title}</span>
      {subtitle ? (
        <>
          <p className="grid-sub">{subtitle}</p>
          <div className="quad-placeholder" aria-hidden>
            <span />
            <span />
            <span />
            <span />
          </div>
        </>
      ) : (
        <div className="single-placeholder home-card-vis" aria-hidden />
      )}
      <span className="grid-more">{hint || 'Shop now'}</span>
    </Link>
  );
}

function Home() {
  return (
    <div className="home-page">
      <section className="hero-wrap amazon-hero-card">
        <img src={heroImg} alt="Spring deals across categories" className="hero-img" />
        <div className="hero-gradient" aria-hidden />
      </section>

      <div className="home-grid-shell">
        <div className="main-grid grid">
          <SearchNavCard
            title="Mother's Day gifts"
            subtitle="Beauty, jewelry, gadgets & more ideas"
            hint="Shop gifts"
            ariaLabel="Mother's Day gifts — go to search"
          />

          <SearchNavCard title="Deals on smart home lighting" ariaLabel="Smart home lighting — go to search" />
          <SearchNavCard title="Electronics bestsellers" ariaLabel="Electronics — go to search" />
          <SearchNavCard title="Fitness & watches" ariaLabel="Fitness — go to search" />
          <SearchNavCard title="Kitchen must-haves" ariaLabel="Kitchen — go to search" />
          <SearchNavCard title="PC accessories" ariaLabel="PC accessories — go to search" />
          <SearchNavCard title="Home essentials" ariaLabel="Home essentials — go to search" />
          <SearchNavCard title="Amazon devices" ariaLabel="Devices — go to search" />
        </div>

        <section className="orange-strip amazon-card" aria-labelledby="welcome-deals">
          <h2 id="welcome-deals" className="deals-heading">
            Welcome deals
          </h2>
          <p className="deals-copy">FREE delivery available on qualifying orders in this demo.</p>

          <div className="deals-row">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <Link key={n} className="deal-card" to="/search" aria-label={`Deal ${n} — open search`}>
                <div className="deal-pic" />
                <p className="deal-title">Limited-time savings</p>
                <div className="deal-meta">
                  <span className="deal-off">Up to 40% off</span>
                  <span className="deal-timer">Ends soon</span>
                </div>
                <div className="deal-prices">
                  <span className="price-new">From $19.99</span>
                  <span className="price-old">List: $39.99</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
