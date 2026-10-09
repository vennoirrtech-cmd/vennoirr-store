import { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FiFilter, FiX } from "react-icons/fi";
import { searchProducts } from "../services/searchService";
import ProductCard from "../components/ProductCard";
import SkeletonCard from "../components/SkeletonCard";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";

  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(false);

  // Filters State
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedSort, setSelectedSort] = useState("newest");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    let active = true;
    if (!q) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(false);
    searchProducts(q)
      .then((res) => {
        if (!active) return;
        let fetched = [];
        if (Array.isArray(res?.data)) fetched = res.data;
        else if (Array.isArray(res?.data?.products)) fetched = res.data.products;
        else if (Array.isArray(res)) fetched = res;
        setResults(fetched);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setError(true);
        setLoading(false);
      });

    return () => { active = false; };
  }, [q]);

  // Derived filters
  const filteredProducts = useMemo(() => {
    let arr = [...results];

    // Category Filter
    if (selectedCategory) {
      arr = arr.filter(
        (p) => p.category?.name?.toLowerCase() === selectedCategory.toLowerCase() || p.gender?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Size Filter
    if (selectedSize) {
      arr = arr.filter((p) => {
        if (p.sizes?.includes(selectedSize)) return true;
        if (p.variants?.some((v) => v.size === selectedSize && v.stock > 0)) return true;
        return false;
      });
    }

    // Sort
    if (selectedSort === "price_low") {
      arr.sort((a, b) => a.price - b.price);
    } else if (selectedSort === "price_high") {
      arr.sort((a, b) => b.price - a.price);
    } else {
      arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return arr;
  }, [results, selectedCategory, selectedSize, selectedSort]);

  // Dynamic filter lists based on results
  const availableCategories = useMemo(() => {
    const cats = new Set();
    results.forEach(p => {
      if (p.category?.name) cats.add(p.category.name);
      if (p.gender && p.gender.toLowerCase() !== 'unisex') cats.add(p.gender);
    });
    return Array.from(cats);
  }, [results]);

  if (loading) {
    return (
      <div style={{ paddingTop: "calc(var(--navbar-height) + 40px)" }}>
        <div className="container">
          <h2>Searching for "{q}"...</h2>
        </div>
        <div className="product-grid" style={{ padding: "40px var(--container-padding)" }}>
          {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  // NO RESULTS FULL PAGE
  if (!loading && results.length === 0) {
    return (
      <div style={{ paddingTop: "calc(var(--navbar-height) + 60px)", paddingBottom: "80px", textAlign: "center", minHeight: "60vh" }}>
        <Helmet><title>No Results For "{q}" | Vennoirr</title></Helmet>
        <div className="container">
          <h1 style={{ marginBottom: "24px", fontFamily: "var(--font-display)", fontSize: "clamp(24px, 4vw, 36px)", textTransform: "uppercase" }}>
            NO RESULTS FOR "{q}"
          </h1>
          <div style={{ maxWidth: "400px", margin: "0 auto", textAlign: "left", marginBottom: "40px", color: "var(--text-secondary)" }}>
            <p>Try:</p>
            <ul style={{ listStyleType: "disc", paddingLeft: "20px", marginTop: "8px", lineHeight: "1.8" }}>
              <li>Checking your spelling</li>
              <li>Using fewer words</li>
              <li>Searching another category</li>
            </ul>
          </div>
          
          <div className="srch-section" style={{ maxWidth: "400px", margin: "0 auto", textAlign: "left" }}>
            <p className="srch-label" style={{ marginBottom: "16px", fontSize: "14px", fontWeight: "600", letterSpacing: "1px" }}>POPULAR SEARCHES</p>
            <div className="srch-chips">
              <Link to="/search?q=Hoodie" className="srch-chip">Hoodies</Link>
              <Link to="/search?q=T-Shirt" className="srch-chip">T-Shirts</Link>
              <Link to="/search?q=Cargo" className="srch-chip">Cargos</Link>
              <Link to="/" className="srch-chip">New Arrivals</Link>
            </div>
            
            <div style={{ marginTop: "40px", textAlign: "center" }}>
              <Link to="/men" className="btn btn-primary" style={{ width: "100%", marginBottom: "12px" }}>SHOP MEN</Link>
              <Link to="/women" className="btn btn-outline" style={{ width: "100%" }}>SHOP WOMEN</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: "calc(var(--navbar-height) + 40px)", paddingBottom: "80px" }}>
      <Helmet><title>Search: {q} | Vennoirr</title></Helmet>
      
      <div className="container">
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: "800", fontSize: "clamp(24px, 4vw, 36px)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>
          RESULTS FOR "{q}"
        </h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: "40px" }}>{results.length} products match your search</p>
      </div>

      <div className="shop-layout">
        {/* MOBILE CONTROLS */}
        <div className="shop-controls">
          <button className="shop-controls-btn" onClick={() => setShowMobileFilters(true)}>
            <FiFilter size={18} /> Filters & Sort
          </button>
          <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
            {filteredProducts.length} Results
          </span>
        </div>

        {showMobileFilters && (
          <div 
            className="mobile-overlay" 
            onClick={() => setShowMobileFilters(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 900 }}
          />
        )}

        {/* SIDEBAR */}
        <aside className={`filter-sidebar ${showMobileFilters ? 'open' : ''}`}>
          <div className="mobile-filter-header">
            <h3>Filters</h3>
            <button onClick={() => setShowMobileFilters(false)}><FiX size={24} /></button>
          </div>

          <div className="filter-section">
            <h4>Sort By</h4>
            <div className="filter-options">
              <label className="filter-label">
                <input type="radio" checked={selectedSort === 'newest'} onChange={() => setSelectedSort('newest')} /> Newest Arrivals
              </label>
              <label className="filter-label">
                <input type="radio" checked={selectedSort === 'price_low'} onChange={() => setSelectedSort('price_low')} /> Price (Low to High)
              </label>
              <label className="filter-label">
                <input type="radio" checked={selectedSort === 'price_high'} onChange={() => setSelectedSort('price_high')} /> Price (High to Low)
              </label>
            </div>
          </div>

          {availableCategories.length > 0 && (
            <div className="filter-section">
              <h4>Category</h4>
              <div className="filter-options">
                {availableCategories.map(cat => (
                  <label key={cat} className="filter-label">
                    <input type="checkbox" checked={selectedCategory === cat} onChange={() => setSelectedCategory(selectedCategory === cat ? '' : cat)} /> {cat.toUpperCase()}
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="filter-section">
            <h4>Size</h4>
            <div className="filter-options">
              {['S', 'M', 'L', 'XL'].map(size => (
                <label key={size} className="filter-label">
                  <input type="checkbox" checked={selectedSize === size} onChange={() => setSelectedSize(selectedSize === size ? '' : size)} /> {size}
                </label>
              ))}
            </div>
          </div>

          <div className="mobile-filter-header" style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setShowMobileFilters(false)}>
              Apply ({filteredProducts.length})
            </button>
          </div>
        </aside>

        {/* GRID */}
        <div className="shop-content">
          {filteredProducts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <h3 style={{ color: "var(--text-secondary)" }}>No items match your selected filters.</h3>
              <button className="btn btn-outline" style={{ marginTop: "20px" }} onClick={() => {
                setSelectedSize(''); setSelectedCategory(''); setSelectedSort('newest');
              }}>
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="product-grid" style={{ padding: 0 }}>
              {filteredProducts.map(p => <ProductCard key={p._id || p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
