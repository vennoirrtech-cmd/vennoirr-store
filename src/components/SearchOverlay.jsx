import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { IoClose, IoSearch } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { searchProducts } from "../services/searchService";
import useTrendingProducts from "../hooks/useTrendingProducts";
import ProductCard from "./ProductCard";
import "../styles/SearchOverlay.css";


// ── Skeleton for the search results loading state ──────────────
function SearchSkeleton({ count = 4 }) {
  return (
    <div className="srch-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="srch-skeleton">
          <div className="srch-skeleton-img skeleton-pulse" />
          <div className="srch-skeleton-line skeleton-pulse" style={{ width: "70%", marginTop: 10 }} />
          <div className="srch-skeleton-line skeleton-pulse" style={{ width: "45%", marginTop: 6 }} />
        </div>
      ))}
    </div>
  );
}


// ── Main overlay ─────────────────────────────────────────────────────────────
const POPULAR = ["Oversized T-shirt", "Hoodie", "Track Pants", "Premium", "Funky"];

export default function SearchOverlay({ onClose }) {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  const [query, setQuery] = useState("");
  const [liveResults, setLiveResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Use the new trending products hook we created
  const { products: trending, loading: trendingLoading, error: trendingError } = useTrendingProducts();
  const trendingSlice = trending.slice(0, 4);

  // Lock body scroll + ESC closes
  useEffect(() => {
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setLiveResults([]);
      setIsSearching(false);
      setHasError(false);
      return;
    }

    setIsSearching(true);
    setHasError(false);
    
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await searchProducts(query.trim());
        let fetched = [];
        if (Array.isArray(res?.data)) {
          fetched = res.data;
        } else if (Array.isArray(res?.data?.products)) {
          fetched = res.data.products;
        } else if (Array.isArray(res)) {
          fetched = res;
        }
        setLiveResults(fetched);
      } catch {
        setHasError(true);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      
      // Simplified keyboard navigation: Arrow keys just jump between focusable elements
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "ArrowRight" || e.key === "ArrowLeft") {
        const overlay = document.querySelector(".srch-overlay");
        if (!overlay) return;
        
        const focusable = Array.from(
          overlay.querySelectorAll('input, button, a[href], [tabindex]:not([tabindex="-1"])')
        ).filter(el => !el.hasAttribute('disabled'));

        const currentIndex = focusable.indexOf(document.activeElement);
        if (currentIndex === -1) return;

        e.preventDefault(); // Prevent page scroll
        let nextIndex = currentIndex;

        if (e.key === "ArrowDown" || e.key === "ArrowRight") {
          nextIndex = currentIndex + 1;
          if (nextIndex >= focusable.length) nextIndex = 0; // Loop back
        } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
          nextIndex = currentIndex - 1;
          if (nextIndex < 0) nextIndex = focusable.length - 1; // Loop to end
        }

        focusable[nextIndex]?.focus();
      }
    },
    [onClose]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleChipClick = (term) => {
    navigate(`/search?q=${encodeURIComponent(term)}`);
    onClose();
  };

  const isActive = query.trim().length > 0;
  const sectionLabel = isActive ? "PRODUCTS" : "TRENDING NOW";

  return (
    <motion.div
      className="srch-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      {/* ── Close button ────────────────────────────────────── */}
      <button
        className="srch-close"
        onClick={onClose}
        aria-label="Close search"
      >
        <IoClose />
      </button>

      {/* ── Content container ───────────────────────────────── */}
      <div className="srch-inner">

        {/* Removed redundant SEARCH label */}

        {/* 2. Input */}
        <form 
          className="srch-field-wrap" 
          onSubmit={(e) => { 
            e.preventDefault(); 
            if (query.trim()) { 
               navigate(`/search?q=${encodeURIComponent(query.trim())}`); 
               onClose(); 
            } 
          }}
        >
          <IoSearch className="srch-icon-left" />
          <input
            ref={inputRef}
            type="text"
            className="srch-input"
            placeholder="Search for anything…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search products"
            autoComplete="off"
            spellCheck="false"
          />
          {query.length > 0 && (
            <button type="button" className="srch-clear" onClick={() => { setQuery(''); inputRef.current?.focus(); }}>
              <IoClose />
            </button>
          )}
          <span className="srch-underline" />
        </form>

        {/* 3. Popular Searches chips */}
        <div className="srch-section" style={{ marginBottom: "32px" }}>
          <p className="srch-label">POPULAR SEARCHES</p>
          <div className="srch-chips">
            {POPULAR.map((item) => (
              <button
                key={item}
                className="srch-chip"
                onClick={() => handleChipClick(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Results / Trending */}
        <div className="srch-section">
          <AnimatePresence mode="wait">
            {isActive ? (
              <motion.div
                key="live"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <p className="srch-label">{sectionLabel}</p>

                {isSearching ? (
                  <SearchSkeleton count={4} />
                ) : hasError ? (
                  <p className="srch-empty-msg">Something went wrong — try again</p>
                ) : liveResults.length > 0 ? (
                  <motion.div
                    className="srch-grid-cards"
                    variants={{ show: { transition: { staggerChildren: 0.03 } } }}
                    initial="hidden"
                    animate="show"
                  >
                    {liveResults.slice(0, 8).map((p) => (
                      <ProductCard key={p._id || p.id} product={p} />
                    ))}
                  </motion.div>
                ) : (
                  /* Empty state */
                  <div className="srch-empty">
                    <p className="srch-empty-msg">
                      No results for <strong>&ldquo;{query}&rdquo;</strong> — try:
                    </p>
                    <div className="srch-chips srch-chips--sm">
                      {POPULAR.slice(0, 3).map((item) => (
                        <button
                          key={item}
                          className="srch-chip"
                          onClick={() => handleChipClick(item)}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="trending"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {!trendingError && !trendingLoading && trendingSlice.length === 0 ? null : (
                    <>
                      <p className="srch-label">TRENDING NOW</p>
                      {trendingLoading ? (
                        <SearchSkeleton count={4} />
                      ) : trendingError ? (
                        // Hide section if error
                        null
                      ) : (
                        <motion.div
                          className="srch-grid-cards"
                          variants={{ show: { transition: { staggerChildren: 0.04 } } }}
                          initial="hidden"
                          animate="show"
                        >
                          {trendingSlice.map((p) => (
                            <ProductCard key={p._id || p.id} product={p} />
                          ))}
                        </motion.div>
                      )}
                    </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </motion.div>
  );
}
