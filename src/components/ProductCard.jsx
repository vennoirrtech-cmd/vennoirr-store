import { useContext } from "react";
import { Link } from "react-router-dom";
import { FiBookmark } from "react-icons/fi";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import ResponsiveImage from "./ResponsiveImage";
import { FadeIn } from "./animations/FadeIn";

export default function ProductCard({ product, openSidebar }) {
  const { addToCart } = useContext(CartContext);
  const { wishlist, toggleWishlist } = useContext(WishlistContext);

  const productId = product._id || product.id;
  const isWishlisted = wishlist.some((item) => (item._id || item.id) === productId);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (openSidebar) {
      openSidebar(product);
    } else {
      const hasVariants = product.variants && product.variants.length > 0;
      let defaultColor = "Black";
      let defaultSize = "M";
      let matchedVariant = null;
      let computedPrice = product.price;

      if (hasVariants) {
        defaultColor = product.variants[0].color || "Black";
        defaultSize = product.variants[0].size || "M";
        matchedVariant = product.variants[0];
        if (matchedVariant.priceDiff) {
          computedPrice += matchedVariant.priceDiff;
        }
      } else {
        defaultSize = product.sizes?.[0] || "M";
      }

      addToCart({
        ...product,
        price: computedPrice,
        size: defaultSize,
        color: defaultColor,
        variant: matchedVariant,
        qty: 1,
      });
    }
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <FadeIn yOffset={30}>
      <Link to={`/product/${productId}`} className="product-card">
        <button
          className={`wishlist-btn ${isWishlisted ? "liked" : ""}`}
          onClick={handleWishlist}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <FiBookmark className="wishlist-icon" />
        </button>

        <div className="card-image">
          <ResponsiveImage
            src={product.image || product.images?.[0]?.url || product.images?.[0] || ""}
            alt={product.title || product.name}
            className="primary-img"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {(product.hoverImage || product.images?.[1]?.url || product.images?.[1]) && (
            <ResponsiveImage
              src={product.hoverImage || product.images?.[1]?.url || product.images?.[1] || ""}
              alt={product.title || product.name}
              className="hover-img"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          )}

          {(product.discount > 0 || product.discountPercent > 0) && (
            <span className="discount-badge">
              SAVE {product.discount || product.discountPercent}%
            </span>
          )}

          {/* Quick Add */}
          <button
            className="quick-add"
            onClick={handleQuickAdd}
          >
            ADD TO CART
          </button>
        </div>

        <div className="card-info">
          <h4>{product.title || product.name}</h4>

          <div className="price-row">
            <span className="sale-price">₹{product.price}</span>

            {(product.originalPrice || product.mrp) && (
              <span className="original-price">
                ₹{product.originalPrice || product.mrp}
              </span>
            )}

            {(product.discount > 0 || product.discountPercent > 0) && (
              <span className="discount-text">
                ({product.discount || product.discountPercent}% OFF)
              </span>
            )}
          </div>
        </div>
      </Link>
    </FadeIn>
  );
}