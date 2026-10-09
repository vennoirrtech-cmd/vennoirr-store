import { useState, useMemo } from "react";
import { FiFilter, FiX } from "react-icons/fi";
import useProducts from "../hooks/useProducts";
import ProductCard from "./ProductCard";
import SkeletonCard from "./SkeletonCard";

export default function ProductGrid({ category, subcategory, sectionData }) {
  // Map frontend's generic 'category' prop to the backend's 'gender' field requirement
  const genderParam = category === 'men' ? 'Men' : category === 'women' ? 'Women' : undefined;

  // We pass limit: 500 to fetch "all available cards" for the category to filter properly on frontend
  const { products, loading } = useProducts(genderParam ? { gender: genderParam, limit: 500 } : { limit: 500 });

  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedSort, setSelectedSort] = useState('newest');

  // Homepage Dynamic Section rendering (bypass shop layout)
  if (sectionData) {
    if (!sectionData.products || sectionData.products.length === 0) return null;
    return (
      <section className="container" style={{ paddingBottom: "40px" }}>
        <div className="section-header-wrapper" style={{ marginTop: "40px" }}>
          <div className="section-header-main">
            <h2>{sectionData.title}</h2>
          </div>
          {sectionData.subtitle && <p className="section-subheading">{sectionData.subtitle}</p>}
        </div>
        {/* We use home-scroll-grid to allow horizontal scrolling on mobile per design rule */}
        <div className="product-grid home-scroll-grid" style={{ paddingTop: "24px" }}>
          {sectionData.products.map((p) => (
            <ProductCard key={p._id || p.id} product={p} />
          ))}
        </div>
      </section>
    );
  }

  // --- Filtering & Sorting Compute ---
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    let result = [...products];

    // Category / Gender filtering
    if (category) {
      result = result.filter(p => 
        p.gender?.toLowerCase() === category.toLowerCase() || 
        p.gender?.toLowerCase() === 'unisex'
      );
    }
    if (subcategory) {
      const sub = subcategory.toLowerCase();
      result = result.filter(p => {
        const catName = p.category?.name?.toLowerCase() || '';
        const hasTag = p.tags?.some(t => t.toLowerCase().includes(sub));
        return catName.includes(sub) || hasTag;
      });
    }

    // Size filtering
    if (selectedSize) {
      result = result.filter(p => {
        if (p.sizes?.includes(selectedSize)) return true;
        if (p.variants?.some(v => v.size === selectedSize && v.stock > 0)) return true;
        return false;
      });
    }

    // Sort order
    if (selectedSort === 'price_low') {
      result.sort((a, b) => a.price - b.price);
    } else if (selectedSort === 'price_high') {
      result.sort((a, b) => b.price - a.price);
    } else { // default newest
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  }, [products, category, subcategory, selectedSize, selectedSort]);

  if (loading) {
    return (
      <div className="product-grid" style={{ padding: "40px var(--container-padding)" }}>
        {[...Array(8)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="shop-layout">
      {/* MOBILE CONTROLS & FILTER DRAWER OVERLAY */}
      <div className="shop-controls">
        <button className="shop-controls-btn" onClick={() => setShowMobileFilters(true)}>
          <FiFilter size={18} /> Filters & Sort
        </button>
        <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
          {filteredProducts.length} Products
        </span>
      </div>

      {showMobileFilters && (
        <div 
          className="mobile-overlay" 
          onClick={() => setShowMobileFilters(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 900 }}
        />
      )}

      {/* FILTER SIDEBAR (Sticky on Desktop, Drawer on Mobile) */}
      <aside className={`filter-sidebar ${showMobileFilters ? 'open' : ''}`}>
        <div className="mobile-filter-header">
          <h3>Filters</h3>
          <button onClick={() => setShowMobileFilters(false)}>
            <FiX size={24} />
          </button>
        </div>

        {/* SORT */}
        <div className="filter-section">
          <h4>Sort By</h4>
          <div className="filter-options">
            <label className="filter-label">
              <input 
                type="radio" 
                name="sort" 
                checked={selectedSort === 'newest'} 
                onChange={() => setSelectedSort('newest')} 
              />
              Newest Arrivals
            </label>
            <label className="filter-label">
              <input 
                type="radio" 
                name="sort" 
                checked={selectedSort === 'price_low'} 
                onChange={() => setSelectedSort('price_low')} 
              />
              Price (Low to High)
            </label>
            <label className="filter-label">
              <input 
                type="radio" 
                name="sort" 
                checked={selectedSort === 'price_high'} 
                onChange={() => setSelectedSort('price_high')} 
              />
              Price (High to Low)
            </label>
          </div>
        </div>

        {/* SIZES */}
        <div className="filter-section">
          <h4>Size</h4>
          <div className="filter-options">
            {['S', 'M', 'L', 'XL'].map((size) => (
              <label key={size} className="filter-label">
                <input 
                  type="checkbox" 
                  checked={selectedSize === size} 
                  onChange={() => setSelectedSize(selectedSize === size ? '' : size)} // Toggle
                />
                {size}
              </label>
            ))}
          </div>
        </div>

        {/* MOBILE APPLY BTN */}
        <div className="mobile-filter-header" style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
          <button 
            className="btn btn-primary" 
            style={{ width: '100%' }}
            onClick={() => setShowMobileFilters(false)}
          >
            Show {filteredProducts.length} Results
          </button>
        </div>
      </aside>

      {/* PRODUCT GRID */}
      <div className="shop-content">
        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: "center", minHeight: "40vh", paddingTop: "40px" }}>
            <h3 style={{ color: "var(--text-secondary)" }}>No products match your filters.</h3>
            <button className="btn btn-outline" style={{ marginTop: "20px" }} onClick={() => {
              setSelectedSize('');
              setSelectedSort('newest');
            }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="product-grid" style={{ padding: 0 }}>
            {filteredProducts.map((p) => (
              <ProductCard key={p._id || p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
