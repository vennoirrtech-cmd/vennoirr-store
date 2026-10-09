import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiBookmark,
  FiShoppingBag,
  FiSearch,
  FiMenu,
  FiX,
  FiChevronDown
} from "react-icons/fi";

import "./Navbar.css";
import LoginModal from "./LoginModal";
import SearchOverlay from "./SearchOverlay";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { menuSlide, opacityFade, staggerLinks } from "../lib/motionVariants";

export default function Navbar() {
  const { pathname } = useLocation();
  const { cart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const isMen = pathname.startsWith("/men");
  const isWomen = pathname.startsWith("/women");
  const isHome = pathname === "/";
  const isOverlay = isHome || isMen || isWomen;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" && window.innerWidth <= 768);

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
    setOpenMenu(null);
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const closeMenu = () => {
    setMobileOpen(false);
    setOpenMenu(null);
  };

  const toggleDropdown = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  let navClass = isOverlay
    ? scrolled
      ? "navbar navbar--scrolled"
      : "navbar navbar--transparent"
    : scrolled
      ? "navbar navbar--scrolled"
      : "navbar navbar--solid";

  if (mobileOpen) {
    navClass += " mobile-active";
  }

  return (
    <>
      <nav className={navClass}>
        {/* LEFT: NAV LINKS (desktop) + HAMBURGER (mobile) */}
        <div className="nav-left-area">
          <div className="hamburger" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </div>

          {!isMobile && (
            <div className="nav-links">
              {/* DESKTOP WOMEN */}
              <div className={`nav-item ${openMenu === "women" ? "open" : ""}`}>
                <div
                  className={`nav-link ${isWomen ? "active" : ""}`}
                  onClick={() => toggleDropdown("women")}
                >
                  Women <FiChevronDown size={13} className={`chevron ${openMenu === "women" ? "rotated" : ""}`} />
                </div>
                <div className={`dropdown ${openMenu === "women" ? "show" : ""}`}>
                  <Link to="/women" onClick={closeMenu}>All Women</Link>
                  <Link to="/women/funky" onClick={closeMenu}>Funky</Link>
                  <Link to="/women/premium" onClick={closeMenu}>Premium</Link>
                </div>
              </div>

              {/* DESKTOP MEN */}
              <div className={`nav-item ${openMenu === "men" ? "open" : ""}`}>
                <div
                  className={`nav-link ${isMen ? "active" : ""}`}
                  onClick={() => toggleDropdown("men")}
                >
                  Men <FiChevronDown size={13} className={`chevron ${openMenu === "men" ? "rotated" : ""}`} />
                </div>
                <div className={`dropdown ${openMenu === "men" ? "show" : ""}`}>
                  <Link to="/men" onClick={closeMenu}>All Men</Link>
                  <Link to="/men/funky" onClick={closeMenu}>Funky</Link>
                  <Link to="/men/premium" onClick={closeMenu}>Premium</Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CENTER: LOGO */}
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          VENNOIRR
        </Link>

        {/* RIGHT: ICONS */}
        <div className="nav-right-area">
          <button
            className="nav-icon-btn"
            onClick={() => setShowSearch(true)}
            aria-label="Search"
            title="Search"
          >
            <FiSearch size={22} strokeWidth={1.5} />
          </button>

          <button
            className="nav-icon-btn"
            onClick={() => { closeMenu(); if (!user) setShowLogin(true); }}
            aria-label="Account"
            title="Account"
          >
            {user ? (
              <Link to="/account" style={{ display: 'flex' }}><FiUser size={22} strokeWidth={1.5} /></Link>
            ) : (
              <FiUser size={22} strokeWidth={1.5} />
            )}
          </button>

          <Link
            to="/wishlist"
            className="nav-icon-btn"
            onClick={closeMenu}
            aria-label="Wishlist"
            title="Wishlist"
          >
            <FiBookmark size={22} strokeWidth={1.5} />
          </Link>

          <Link
            to="/cart"
            className="nav-icon-btn cart-icon-btn"
            onClick={closeMenu}
            aria-label="Cart"
            title="Cart"
          >
            <FiShoppingBag size={22} strokeWidth={1.5} />
            {cart.length > 0 && <span className="cart-badge-solid">{cart.length}</span>}
          </Link>
        </div>
      </nav>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {isMobile && mobileOpen && (
          <motion.div
            className="nav-links mobile-drawer"
            variants={menuSlide}
            initial="initial"
            animate="enter"
            exit="exit"
            style={{ left: 0 }} /* Override legacy active css */
          >
            <motion.div custom={1} variants={staggerLinks} initial="initial" animate="enter" exit="exit" className={`nav-item ${openMenu === "women" ? "open" : ""}`}>
              <div className={`nav-link ${isWomen ? "active" : ""}`} onClick={() => toggleDropdown("women")}>
                Women <FiChevronDown size={13} className={`chevron ${openMenu === "women" ? "rotated" : ""}`} />
              </div>
              <div className="dropdown">
                <Link to="/women" onClick={closeMenu}>All Women</Link>
                <Link to="/women/funky" onClick={closeMenu}>Funky</Link>
                <Link to="/women/premium" onClick={closeMenu}>Premium</Link>
              </div>
            </motion.div>

            <motion.div custom={2} variants={staggerLinks} initial="initial" animate="enter" exit="exit" className={`nav-item ${openMenu === "men" ? "open" : ""}`}>
              <div className={`nav-link ${isMen ? "active" : ""}`} onClick={() => toggleDropdown("men")}>
                Men <FiChevronDown size={13} className={`chevron ${openMenu === "men" ? "rotated" : ""}`} />
              </div>
              <div className="dropdown">
                <Link to="/men" onClick={closeMenu}>All Men</Link>
                <Link to="/men/funky" onClick={closeMenu}>Funky</Link>
                <Link to="/men/premium" onClick={closeMenu}>Premium</Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mobile-overlay"
            variants={opacityFade}
            initial="initial"
            animate="enter"
            exit="exit"
            onClick={closeMenu}
            style={{ animation: "none" }} /* Override legacy css */
          />
        )}
      </AnimatePresence>

      {/* MODALS */}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showSearch && <SearchOverlay onClose={() => setShowSearch(false)} />}
    </>
  );
}