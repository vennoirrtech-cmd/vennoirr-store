import { Link } from "react-router-dom";
import { FiInstagram, FiTwitter, FiFacebook, FiYoutube } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        {/* BRAND */}
        <div className="footer-brand">
          <h1>VENNOIRR</h1>

          <div className="footer-socials">
            <a href="https://www.instagram.com/vennoirrr?igsh=aDRtcGtkMWZoaHh1" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FiInstagram /></a>
            <a href="#" aria-label="Twitter"><FiTwitter /></a>
            <a href="#" aria-label="Facebook"><FiFacebook /></a>
            <a href="#" aria-label="YouTube"><FiYoutube /></a>
          </div>
        </div>
        {/* HELP */}
        <div className="footer-column">
          <h4>HELP</h4>
          <Link to="/terms" style={{ color: 'inherit', textDecoration: 'none', display: 'block' }}>Terms & Conditions</Link>
          <Link to="/privacy" style={{ color: 'inherit', textDecoration: 'none', display: 'block', marginTop: '10px' }}>Privacy Policy</Link>
          <Link to="/returns" style={{ color: 'inherit', textDecoration: 'none', display: 'block', marginTop: '10px' }}>Returns & Exchange</Link>
          <Link to="/faq" style={{ color: 'inherit', textDecoration: 'none', display: 'block', marginTop: '10px' }}>FAQs</Link>
          <Link to="/contact" style={{ color: 'inherit', textDecoration: 'none', display: 'block', marginTop: '10px' }}>Contact Us</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 Vennoirr. All rights reserved.</span>
        <span>Premium Streetwear Fashion</span>
      </div>
    </footer>
  );
}
