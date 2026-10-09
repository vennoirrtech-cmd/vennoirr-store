import { useContext } from "react";
import { Link } from "react-router-dom";
import { WishlistContext } from "../context/WishlistContext";
import { CartContext } from "../context/CartContext";
import { FiTrash2, FiShoppingBag } from "react-icons/fi";
import { optimizeImage } from "../utils/imageOptimization";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  const handleMoveToCart = (product) => {
    addToCart({ ...product, size: product.sizes?.[0] || "M", qty: 1 });
    removeFromWishlist(product._id || product.id);
  };

  return (
    <div className="cart-page">
      <h2>Wishlist</h2>

      {wishlist.length === 0 ? (
        <div className="empty-cart">
          <p>Your wishlist is empty</p>
          <Link to="/" className="shop-btn">DISCOVER PRODUCTS</Link>
        </div>
      ) : (
        <div className="product-grid" style={{ padding: 0 }}>
          {wishlist.map((product) => {
            const pid = product._id || product.id;
            const imgSrc = optimizeImage(
              product.image || product.images?.[0]?.url || product.images?.[0] || "",
              600
            );

            return (
              <div key={pid} className="wishlist-card">
                {/* Plain static image — no hover swap */}
                <Link to={`/product/${pid}`} className="wishlist-card__img-wrap">
                  <img
                    src={imgSrc}
                    alt={product.title || product.name}
                    loading="lazy"
                    decoding="async"
                  />
                  {(product.discount > 0 || product.discountPercent > 0) && (
                    <span className="discount-badge">
                      SAVE {product.discount || product.discountPercent}%
                    </span>
                  )}
                </Link>

                <div className="card-info">
                  <h4>{product.title || product.name}</h4>
                  <div className="price-row">
                    <span className="sale-price">₹{product.price}</span>
                  </div>

                  <div className="wishlist-card__actions">
                    <button
                      className="wishlist-card__move-btn"
                      onClick={() => handleMoveToCart(product)}
                      aria-label="Move to cart"
                    >
                      <FiShoppingBag size={14} /> MOVE TO CART
                    </button>
                    <button
                      className="wishlist-card__remove-btn"
                      onClick={() => removeFromWishlist(pid)}
                      aria-label="Remove from wishlist"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
