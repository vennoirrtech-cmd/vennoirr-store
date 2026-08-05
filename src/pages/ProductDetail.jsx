import { useParams, Link } from "react-router-dom";
import { useState, useContext } from "react";
import { Helmet } from "react-helmet-async";
import { FiHeart, FiChevronDown, FiChevronUp } from "react-icons/fi";
import useProducts from "../hooks/useProducts";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import ProductCard from "../components/ProductCard";
import { optimizeImage } from "../utils/imageOptimization";

export default function ProductDetail() {
  const { id } = useParams();
  const { products } = useProducts();
  const product = products.find((p) => p._id === id || String(p.id) === String(id));
  const { addToCart } = useContext(CartContext);
  const { wishlist, toggleWishlist } = useContext(WishlistContext);

  const [selectedSize, setSelectedSize] = useState("");
  const [qty, setQty] = useState(1);
  const [descOpen, setDescOpen] = useState(true);

  if (!product) {
    return (
      <div className="cart-page">
        <h2>Product Not Found</h2>
        <div className="empty-cart">
          <p>The product you're looking for doesn't exist.</p>
          <Link to="/" className="shop-btn">BACK TO HOME</Link>
        </div>
      </div>
    );
  }

  const isWishlisted = wishlist.some((item) => (item._id || item.id) === (product._id || product.id));
  const sizes = product.sizes || ["S", "M", "L", "XL"];

  const relatedProducts = products
    .filter((p) => p.category === product.category && (p._id || p.id) !== (product._id || product.id))
    .slice(0, 4);

  const handleAddToCart = () => {
    const size = selectedSize || sizes[1] || sizes[0];
    addToCart({ ...product, size, qty });
  };

  const categoryName = product.category?.name || product.category || "Fashion";
  const productName = product.title || product.name;
  const productImage = optimizeImage(product.image || product.images?.[0]?.url || product.images?.[0] || "", 1000);

  return (
    <div style={{ paddingTop: "calc(var(--navbar-height) + 20px)" }}>
      {/* Dynamic SEO Tags & Schema Markup */}
      <Helmet>
        <title>{productName} | Premium Streetwear | Vennoirr</title>
        <meta name="description" content={`Buy ${productName} at Vennoirr. ${product.description ? product.description.substring(0, 100) : "Premium quality streetwear crafted with the finest materials"}. Free Shipping in India!`} />
        <meta property="og:title" content={`${productName} | Vennoirr`} />
        <meta property="og:image" content={productImage} />
        <meta property="og:type" content="product" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": productName,
            "image": productImage,
            "description": product.description || "Premium streetwear.",
            "brand": {
              "@type": "Brand",
              "name": "Vennoirr"
            },
            "offers": {
              "@type": "Offer",
              "url": window.location.href,
              "priceCurrency": "INR",
              "price": product.price,
              "availability": "https://schema.org/InStock",
              "itemCondition": "https://schema.org/NewCondition"
            }
          })}
        </script>
      </Helmet>

      {/* BREADCRUMB */}
      <div style={{
        padding: "12px var(--container-padding)",
        fontSize: "12px",
        color: "var(--text-secondary)",
        letterSpacing: "0.5px",
      }}>
        <Link to="/" style={{ color: "var(--text-secondary)" }}>Home</Link>
        {" / "}
        <Link to={`/${product.category?.slug || product.category}`} style={{ color: "var(--text-secondary)", textTransform: "capitalize" }}>
          {product.category?.name || product.category}
        </Link>
        {" / "}
        <span style={{ color: "var(--text-primary)" }}>{product.title || product.name}</span>
      </div>

      {/* PRODUCT LAYOUT */}
      <div className="pdp-layout">
        {/* LEFT: IMAGES */}
        <div className="pdp-images">
          <img
            src={optimizeImage(product.image || product.images?.[0]?.url || product.images?.[0] || "", 1000)}
            alt={product.title || product.name}
            className="pdp-main-img"
            decoding="sync"
          />
          {(product.hoverImage || product.images?.[1]?.url || product.images?.[1]) && (
            <img
              src={optimizeImage(product.hoverImage || product.images?.[1]?.url || product.images?.[1] || "", 1000)}
              alt={product.title || product.name}
              className="pdp-secondary-img"
              loading="lazy"
              decoding="async"
            />
          )}
        </div>

        {/* RIGHT: DETAILS */}
        <div className="pdp-details">
          {product.discount > 0 && (
            <span className="pdp-badge">SAVE {product.discount}%</span>
          )}

          <h1 className="pdp-title">{product.title || product.name}</h1>

          <div className="pdp-price-row">
            <span className="pdp-price">₹{product.price}</span>
            {(product.originalPrice || product.mrp) && (
              <span className="pdp-original">₹{product.originalPrice || product.mrp}</span>
            )}
            {product.discount > 0 && (
              <span className="pdp-discount">({product.discount}% OFF)</span>
            )}
          </div>

          {/* SIZE SELECTOR */}
          <div className="pdp-sizes">
            <p className="pdp-label">Select Size</p>
            <div className="pdp-size-options">
              {sizes.map((s) => (
                <button
                  key={s}
                  className={selectedSize === s ? "active" : ""}
                  onClick={() => setSelectedSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* QUANTITY */}
          <div className="pdp-qty-row">
            <p className="pdp-label">Qty</p>
            <div className="pdp-qty-controls">
              <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(qty + 1)}>+</button>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="pdp-actions">
            <button className="pdp-add-btn" onClick={handleAddToCart}>
              ADD TO CART
            </button>
            <button
              className={`pdp-wish-btn ${isWishlisted ? "active" : ""}`}
              onClick={() => toggleWishlist(product)}
            >
              <FiHeart size={20} fill={isWishlisted ? "currentColor" : "none"} />
            </button>
          </div>

          {/* DESCRIPTION ACCORDION */}
          <div className="pdp-accordion">
            <button className="pdp-accordion-header" onClick={() => setDescOpen(!descOpen)}>
              Product Description
              {descOpen ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            {descOpen && (
              <p className="pdp-accordion-body">
                {product.description || "Premium quality streetwear crafted with the finest materials. Designed for comfort and style."}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <div style={{ padding: "0 var(--container-padding) 60px" }}>
          <div className="section-header">
            <h2>You May Also Like</h2>
          </div>
          <div className="product-grid" style={{ padding: 0 }}>
            {relatedProducts.map((p) => (
              <ProductCard key={p._id || p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
