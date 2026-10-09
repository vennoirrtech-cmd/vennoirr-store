import { useState } from "react";
import { Link } from "react-router-dom";
import { FiInstagram, FiTwitter, FiFacebook, FiYoutube, FiArrowRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import "./Footer.css";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setEmail("");
      }, 5000);
    }
  };

  return (
    <footer className="footer-premium">
      <div className="footer-premium-container">
        
        {/* ROW 1: Grid */}
        <div className="footer-grid-4">
          
          {/* Column 1: Brand & Socials */}
          <div className="footer-brand">
            <h2>VENNOIRR</h2>
            <p className="footer-tagline">Premium Streetwear. Made in India.</p>
            <div className="footer-socials">
              <a href="https://www.instagram.com/vennoirrr" target="_blank" rel="noopener noreferrer" aria-label="Vennoirr on Instagram">
                <FiInstagram size={20} />
              </a>
              <a href="#" aria-label="Vennoirr on X">
                <FiTwitter size={20} />
              </a>
              <a href="#" aria-label="Vennoirr on Facebook">
                <FiFacebook size={20} />
              </a>
              <a href="#" aria-label="Vennoirr on YouTube">
                <FiYoutube size={20} />
              </a>
            </div>
          </div>

          {/* Column 2: SHOP */}
          <nav className="footer-nav-col">
            <h4>SHOP</h4>
            <ul>
              <li><Link to="/women">Women</Link></li>
              <li><Link to="/men">Men</Link></li>
              <li><Link to="/new-arrivals">New Arrivals</Link></li>
              <li><Link to="/sale">Sale</Link></li>
            </ul>
          </nav>

          {/* Column 3: SUPPORT */}
          <nav className="footer-nav-col">
            <h4>SUPPORT</h4>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/faq">FAQs</Link></li>
              <li><Link to="/returns">Returns</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/size-guide">Size Guide</Link></li>
              <li><Link to="/shipping">Shipping</Link></li>
            </ul>
          </nav>

          {/* Column 4: NEWSLETTER */}
          <div className="footer-nav-col">
            <h4>NEWSLETTER</h4>
            <p className="newsletter-desc">Join the club for exclusive drops.</p>
            <form className="newsletter-form" onSubmit={handleSubscribe}>
              <input 
                type="email" 
                className="newsletter-input" 
                placeholder="Email Address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={submitted}
              />
              <button 
                type="submit" 
                className="newsletter-submit" 
                aria-label="Subscribe"
                disabled={submitted}
              >
                <FiArrowRight size={20} />
              </button>
            </form>
            <AnimatePresence>
              {submitted && (
                <motion.div 
                  className="newsletter-success"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  You're on the list &nbsp;✓
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ROW 3: Bottom Bar */}
        <div className="footer-bottom-bar">
          <div className="footer-copyright">
            © {new Date().getFullYear()} VENNOIRR.
          </div>
          <div className="footer-bottom-links">
            <Link to="/terms">Terms</Link>
            <Link to="/privacy">Privacy</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
