import { useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import { optimizeImage } from "../utils/imageOptimization";

export default function ProductSidebar({ product, close }) {
  const { addToCart } = useContext(CartContext);
  const [size, setSize] = useState("");

  if (!product) return null;

  const sizes = product.sizes || ["S", "M", "L", "XL"];

  const handleAdd = () => {
    const selectedSize = size || sizes[0] || "M";
    addToCart({ ...product, size: selectedSize, qty: 1 });
    close();
  };

  return (
    <>
      <div className="product-sidebar-overlay" onClick={close}></div>
      <div className="product-sidebar">
        <button className="sidebar-close" onClick={close}>✕</button>

        <img 
          src={optimizeImage(product.image || product.images?.[0]?.url || product.images?.[0] || "", 800)} 
          alt={product.title || product.name} 
          className="sidebar-image" 
          loading="lazy"
          decoding="async"
        />

        <h3>{product.title}</h3>
        <p className="sidebar-price">
          ₹{product.price}
          {product.originalPrice && (
            <span className="original">₹{product.originalPrice}</span>
          )}
        </p>

        <div className="size-selector">
          <label>Select Size</label>
          <div className="size-options">
            {sizes.map((s) => (
              <button
                key={s}
                className={size === s ? "active" : ""}
                onClick={() => setSize(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <button className="add-to-cart-btn" onClick={handleAdd}>
          ADD TO CART
        </button>
      </div>
    </>
  );
}
