import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="about-page">
      <Helmet>
        <title>About Us | Vennoirr — Premium Streetwear</title>
        <meta name="description" content="Learn the story behind Vennoirr — India's boldest premium streetwear brand. Made in India. Built for expression." />
        <link rel="canonical" href="https://vennoirr.com/about" />
      </Helmet>

      {/* HERO */}
      <div className="about-hero">
        <div className="about-hero-content">
          <p className="about-hero-label">OUR STORY</p>
          <h1 className="about-hero-title">Born to stand out.</h1>
          <p className="about-hero-sub">
            Vennoirr is a premium streetwear brand born out of a belief — that fashion should feel as bold as the person wearing it.
          </p>
        </div>
      </div>

      {/* BRAND STORY */}
      <div className="about-section">
        <div className="about-section-inner">
          <h2>Who We Are</h2>
          <p>
            Vennoirr was founded with a simple mission: to create streetwear that speaks for itself. Every piece is designed 
            to feel premium, look bold, and last. We source the finest fabrics, obsess over every stitch, and refuse to compromise on quality.
          </p>
          <p>
            From our Funky collection for those who want to make a loud statement to our Premium line crafted for quiet luxury — 
            Vennoirr has something for everyone who believes fashion is self-expression.
          </p>
        </div>
      </div>

      {/* VALUES */}
      <div className="about-values">
        <div className="about-value-card">
          <div className="about-value-icon">🇮🇳</div>
          <h3>Made in India</h3>
          <p>Proudly designed and crafted in India. Supporting local artisans and sustainable manufacturing.</p>
        </div>
        <div className="about-value-card">
          <div className="about-value-icon">✨</div>
          <h3>Premium Quality</h3>
          <p>We refuse to skimp on materials. Every fabric is chosen for comfort, durability, and feel.</p>
        </div>
        <div className="about-value-card">
          <div className="about-value-icon">🎨</div>
          <h3>Bold Expression</h3>
          <p>Our designs push boundaries. We believe streetwear is a canvas for individuality.</p>
        </div>
      </div>

      {/* CTA */}
      <div className="about-cta">
        <h2>Ready to elevate your wardrobe?</h2>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '24px' }}>
          <Link to="/men" className="shop-btn">SHOP MEN</Link>
          <Link to="/women" className="shop-btn shop-btn--outline">SHOP WOMEN</Link>
        </div>
      </div>
    </div>
  );
}
