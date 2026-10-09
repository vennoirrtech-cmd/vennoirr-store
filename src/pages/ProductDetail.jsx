import { useParams, Link } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { FiHeart, FiChevronDown, FiChevronUp } from "react-icons/fi";
import useProducts from "../hooks/useProducts";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import ProductCard from "../components/ProductCard";
import ProductCarousel from "../components/ProductCarousel";
import ResponsiveImage from "../components/ResponsiveImage";
import { StaggerContainer, StaggerItem } from "../components/animations/FadeIn";
import ProductReviews from "../components/ProductReviews";

export default function ProductDetail() {
  const { id } = useParams();
  
  // Ensure we start at the top of the page when clicking a product
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const { products, loading } = useProducts();
  // Resolve by _id, numeric id, OR slug (search overlay links by slug)
  const product = products.find(
    (p) => p._id === id || String(p.id) === String(id) || p.slug === id
  );
  const { addToCart } = useContext(CartContext);
  const { wishlist, toggleWishlist } = useContext(WishlistContext);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [qty, setQty] = useState(1);
  const [descOpen, setDescOpen] = useState(true);
  const [activeImg, setActiveImg] = useState(0);

  if (loading) {
    return (
      <div className="product-detail-page section-container" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: "var(--text-muted)" }}>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="cart-page">
        <h2>Product Not Found</h2>
        <div className="empty-cart">
          <p>The product you&apos;re looking for doesn&apos;t exist.</p>
          <Link to="/" className="shop-btn">BACK TO HOME</Link>
        </div>
      </div>
    );
  }

  // NEW: Image & Related Logic
  const galleryImages = product.images?.length > 0 
    ? product.images.map(img => img.url || img) 
    : (product.image ? [product.image] : []);
  const currentImage = galleryImages[activeImg] || "";
  
  const relatedProducts = products
    .filter(p => (p.category?._id === product.category?._id || p.category === product.category) && p._id !== product._id)
    .slice(0, 4);

  // NEW: Variant Processing Matrix
  const hasVariants = product.variants && product.variants.length > 0;
  
  const colors = hasVariants 
    ? [...new Set(product.variants.map(v => v.color).filter(Boolean))] 
    : (product.colors || ["Black"]);
    
  // If a color is selected, only show sizes for that color that are active
  const availableSizesForColor = (color) => {
    if (!hasVariants) return product.sizes || ["S", "M", "L", "XL"];
    const variantsForColor = product.variants.filter(v => v.color === color && v.isActive !== false);
    return [...new Set(variantsForColor.map(v => v.size).filter(Boolean))];
  };

  const sizes = selectedColor ? availableSizesForColor(selectedColor) : availableSizesForColor(colors[0] || "");
  
  // Set default selections once loaded
  if (hasVariants && (!selectedColor || !selectedSize)) {
    if (colors.length > 0 && !selectedColor) setSelectedColor(colors[0]);
    // Note: size handles itself in the mapping below, but we can reset if needed.
  }

  // Get EXACT selected variant
  const selectedVariant = hasVariants ? product.variants.find(
    v => v.color === (selectedColor || colors[0]) && v.size === selectedSize
  ) : null;

  const currentPrice = selectedVariant?.priceDiff 
    ? (product.price + selectedVariant.priceDiff) 
    : product.price;

  const maxStock = selectedVariant 
    ? selectedVariant.stockCount 
    : (product.stockCount || 10);

  const handleAddToCart = () => {
    if (maxStock <= 0) return; // Prevent adding if physically out of stock
    
    const size = selectedSize || sizes[0] || "M";
    const color = selectedColor || colors[0] || "Black";
    addToCart({ 
      ...product, 
      price: currentPrice, // override base price
      variant: selectedVariant, 
      size, 
      color, 
      qty 
    });
  };

  const categoryName = product.category?.name || product.category || "Fashion";
  const productName = product.title || product.name;
  const productImage = currentImage || "";

  return (
    <div style={{ paddingTop: "calc(var(--navbar-height) + 20px)" }}>
      {/* Dynamic SEO Tags & Schema Markup */}
      <Helmet>
        <title>{productName} | Premium Streetwear | Vennoirr</title>
        <meta name="description" content={`Buy ${productName} at Vennoirr. ${product.description ? product.description.substring(0, 100) : "Premium quality streetwear crafted with the finest materials"}. Free Shipping in India!`} />
        <meta property="og:title" content={`${productName} | Vennoirr`} />
        <meta property="og:image" content={productImage} />
        <meta property="og:type" content="product" />
        <link rel="canonical" href={`https://vennoirr.com/product/${product._id || product.id}`} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": productName,
            "image": productImage,
            "description": product.description || "Premium streetwear.",
            "brand": { "@type": "Brand", "name": "Vennoirr" },
            "offers": {
              "@type": "Offer",
              "url": `https://vennoirr.com/product/${product._id || product.id}`,
              "priceCurrency": "INR",
              "price": currentPrice,
              "availability": maxStock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              "itemCondition": "https://schema.org/NewCondition"
            }
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://vennoirr.com" },
              { "@type": "ListItem", "position": 2, "name": categoryName, "item": `https://vennoirr.com/${product.category?.slug || product.category}` },
              { "@type": "ListItem", "position": 3, "name": productName }
            ]
          })}
        </script>
      </Helmet>

      {/* PRODUCT LAYOUT */}
      <StaggerContainer className="pdp-layout">
        {/* LEFT: IMAGES + GALLERY */}
        <StaggerItem className="pdp-images">
          <div className="pdp-main-img-wrap">
            <ResponsiveImage
              src={currentImage}
              alt={`${productName} — Vennoirr Streetwear`}
              className="pdp-main-img"
              sizes="(max-width: 768px) 100vw, 50vw"
              loading="eager"
            />
          </div>

          {/* Thumbnail strip */}
          {galleryImages.length > 1 && (
            <div className="pdp-thumb-strip">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  className={`pdp-thumb-btn ${activeImg === idx ? "active" : ""}`}
                  onClick={() => setActiveImg(idx)}
                  aria-label={`View image ${idx + 1}`}
                >
                  <ResponsiveImage src={img} alt="" sizes="100px" />
                </button>
              ))}
            </div>
          )}
        </StaggerItem>

        {/* RIGHT: DETAILS */}
        <StaggerItem className="pdp-details">
          {product.discount > 0 && (
            <span className="pdp-badge">SAVE {product.discount}%</span>
          )}

          <h1 className="pdp-title">{productName}</h1>

          <div className="pdp-price-row">
            <span className={`pdp-price ${(product.originalPrice || product.mrp) ? 'sale-price' : ''}`}>₹{currentPrice}</span>
            {(product.originalPrice || product.mrp) && (
              <span className="pdp-original">₹{product.originalPrice || product.mrp}</span>
            )}
          </div>

          <p className="pdp-desc-text">
            {product.description || "Crafted from premium double-faced merino wool, this overshirt offers a refined silhouette and exceptional comfort. Buttoned-to-top design with clean lines."}
          </p>

          {/* COLOR SELECTOR */}
          {colors.length > 1 && (
            <div className="pdp-sizes" style={{ marginTop: '20px' }}>
              <div className="pdp-sizes-header">
                <span className="pdp-label">COLOR: {selectedColor}</span>
              </div>
              <div className="pdp-size-options" style={{ gap: '10px' }}>
                {colors.map((c) => (
                  <button
                    key={c}
                    className={`pdp-color-btn ${selectedColor === c ? "active" : ""}`}
                    onClick={() => {
                      setSelectedColor(c);
                      setSelectedSize(""); // Reset size on color change
                    }}
                    style={{ padding: '8px 16px', border: selectedColor === c ? '2px solid var(--ink)' : '1px solid var(--border)', background: 'transparent' }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SIZE SELECTOR */}
          <div className="pdp-sizes" style={{ marginTop: '20px' }}>
            <div className="pdp-sizes-header">
              <span className="pdp-label">SIZE</span>
              <button className="pdp-size-guide">SIZE GUIDE</button>
            </div>
            <div className="pdp-size-options">
              {sizes.map((s) => {
                let isOOS = product.outOfStockSizes?.includes(s) || false;
                
                // Variant-specific checking
                if (hasVariants && selectedColor) {
                  const specificVariant = product.variants.find(v => v.color === selectedColor && v.size === s);
                  if (specificVariant && specificVariant.stockCount <= 0) {
                    isOOS = true;
                  }
                }

                return (
                  <button
                    key={s}
                    className={`${selectedSize === s ? "active" : ""} ${isOOS ? "oos" : ""}`}
                    onClick={() => !isOOS && setSelectedSize(s)}
                    disabled={isOOS}
                    title={isOOS ? "Out of Stock" : ""}
                    aria-label={isOOS ? `${s} — Out of Stock` : `Select size ${s}`}
                  >
                    {s}{isOOS ? " ✕" : ""}
                  </button>
                );
              })}
            </div>
            
            {selectedSize && maxStock <= 5 && maxStock > 0 && (
              <div style={{ color: 'var(--brand)', fontSize: '11px', marginTop: '8px', fontWeight: 600, textTransform: 'uppercase' }}>
                Hurry, only {maxStock} left in stock!
              </div>
            )}
            {selectedSize && maxStock <= 0 && (
              <div style={{ color: 'var(--error)', fontSize: '11px', marginTop: '8px', fontWeight: 600, textTransform: 'uppercase' }}>
                Out of Stock in this variant
              </div>
            )}
          </div>

          {/* ACTION BUTTON */}
          <div className="pdp-actions">
            <button 
              className={`pdp-add-btn primary-cta ${maxStock <= 0 || !selectedSize ? 'disabled' : ''}`} 
              onClick={() => handleAddToCart()}
              disabled={maxStock <= 0 || !selectedSize}
              style={{ opacity: (maxStock <= 0 || !selectedSize) ? 0.5 : 1, cursor: (maxStock <= 0 || !selectedSize) ? 'not-allowed' : 'pointer' }}
            >
              {maxStock <= 0 ? 'OUT OF STOCK' : !selectedSize ? 'SELECT SIZE' : 'ADD TO BAG'}
            </button>
          </div>

          {/* DESCRIPTION ACCORDION */}
          <div className="pdp-accordion-group">
            <div className="pdp-accordion">
              <button className="pdp-accordion-header" onClick={() => setDescOpen(!descOpen)}>
                PRODUCT DETAILS
                {descOpen ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              {descOpen && (
                <div className="pdp-accordion-body">
                  <p>Model is wearing size L. Refined cut, designed to layer elegantly over t-shirts and knits. True to size.</p>
                </div>
              )}
            </div>

            <div className="pdp-accordion">
              <button className="pdp-accordion-header">
                SHIPPING & RETURNS
                <FiChevronDown />
              </button>
            </div>

            <div className="pdp-accordion">
              <button className="pdp-accordion-header">
                COMPOSITION & CARE
                <FiChevronDown />
              </button>
            </div>
          </div>

          <ProductReviews productId={product._id || product.id} />
        </StaggerItem>
      </StaggerContainer>

      {/* MOBILE STICKY ADD TO CART */}
      <div className="pdp-mobile-sticky">
        <button 
          className={`pdp-add-btn primary-cta ${maxStock <= 0 || !selectedSize ? 'disabled' : ''}`} 
          onClick={handleAddToCart}
          disabled={maxStock <= 0 || !selectedSize}
          style={{ 
            width: '100%', 
            opacity: (maxStock <= 0 || !selectedSize) ? 0.5 : 1, 
            cursor: (maxStock <= 0 || !selectedSize) ? 'not-allowed' : 'pointer',
            height: '48px',
            background: 'var(--ink)',
            color: 'var(--surface)',
            border: 'none',
            borderRadius: 'var(--r-btn)',
            fontFamily: 'var(--font-body)',
            fontWeight: 500,
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textTransform: 'uppercase'
          }}
        >
          {maxStock <= 0 ? 'OUT OF STOCK' : !selectedSize ? 'SELECT SIZE' : 'ADD TO CART'}
        </button>
      </div>

      {/* RELATED PRODUCTS (SCROLLING CAROUSEL) */}
      {relatedProducts.length > 0 && (
        <div style={{ marginBottom: "60px" }}>
          <ProductCarousel section={{
            title: "You May Also Like",
            slug: "related-products",
            products: relatedProducts
          }} />
        </div>
      )}
    </div>
  );
}
