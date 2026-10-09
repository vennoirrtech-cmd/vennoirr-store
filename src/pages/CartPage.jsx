import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { optimizeImage } from "../utils/imageOptimization";
import { LuShieldCheck, LuBadgeIndianRupee, LuTruck, LuPackageCheck } from "react-icons/lu";
import { StaggerContainer, StaggerItem } from "../components/animations/FadeIn";
import { motion } from "framer-motion";

export default function CartPage() {
  const { cart, removeFromCart, updateQty, cartTotal } = useContext(CartContext);
  const [coupon, setCoupon] = useState("");
  const [orderNote, setOrderNote] = useState("");

  const applyCoupon = () => {
    // Placeholder — backend endpoint: POST /api/v1/coupons/validate
    import("react-hot-toast").then(({ toast }) => {
      toast("Coupon codes coming soon!", { icon: "🎫" });
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="cart-page"
    >

      <h2 className="cart-page-title">Your Cart</h2>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <Link to="/" className="shop-btn primary-cta">CONTINUE SHOPPING</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <StaggerContainer className="cart-items">
            {cart.map((item) => (
              <StaggerItem key={`${item._id || item.id}-${item.size}`}>
                <div className="cart-item">
                  <img
                    src={optimizeImage(item.image || item.images?.[0]?.url || item.images?.[0] || "", 400)}
                    alt={item.title || item.name || "Product"}
                    loading="lazy"
                    className="cart-item-img"
                  />
                  <div className="cart-item-details">
                    <h4>{item.title || item.name || "Product"}</h4>
                    <p className="item-meta">
                      {item.size && <span>Size: {item.size}</span>}
                      {item.size && item.color && <span> | </span>}
                      {item.color && <span>Color: {item.color}</span>}
                    </p>
                    <p className="item-price">₹{item.price * item.quantity}</p>
                    <div className="qty-controls">
                      <button
                        onClick={() => updateQty(item._id || item.id, item.size, item.color, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span aria-live="polite" aria-label={`Quantity: ${item.quantity}`}>{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item._id || item.id, item.size, item.color, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <button className="remove-btn" onClick={() => removeFromCart(item._id || item.id, item.size, item.color)}>
                      Remove
                    </button>
                  </div>
                </div>
              </StaggerItem>
            ))}

            <div className="cart-order-note">
              <label htmlFor="order-note" className="order-note-label">Order Note</label>
              <textarea
                id="order-note"
                placeholder="Special instructions for your order..."
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
                className="order-note-textarea"
                rows="3"
              ></textarea>
            </div>

            {/* Continue Shopping */}
            <Link to="/" className="continue-shopping-link">← Continue Shopping</Link>
          </StaggerContainer>

          <div className="cart-summary">
            <h3>Order Summary</h3>

            {/* Coupon code */}
            <div className="coupon-row">
              <input
                placeholder="Enter coupon code"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                aria-label="Coupon code"
              />
              <button onClick={applyCoupon} className="coupon-apply-btn">APPLY</button>
            </div>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{cartTotal}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{cartTotal >= 999 ? "FREE" : "₹99"}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>₹{cartTotal >= 999 ? cartTotal : cartTotal + 99}</span>
            </div>

            <Link to="/checkout" className="checkout-btn primary-cta" style={{ display: "block", textAlign: "center" }}>
              GO TO CHECKOUT
            </Link>

            {/* Trust badges */}
            <div className="trust-badges">
              <div className="trust-badge-item">
                <LuShieldCheck size={20} strokeWidth={1.5} />
                <div>
                  <p>Secure Payment</p>
                  <span>SSL encrypted</span>
                </div>
              </div>
              <div className="trust-badge-item">
                <LuBadgeIndianRupee size={20} strokeWidth={1.5} />
                <div>
                  <p>Razorpay</p>
                  <span>UPI · Cards · Net Banking</span>
                </div>
              </div>
              <div className="trust-badge-item">
                <LuTruck size={20} strokeWidth={1.5} />
                <div>
                  <p>Free Shipping</p>
                  <span>Orders above ₹999</span>
                </div>
              </div>
              <div className="trust-badge-item">
                <LuPackageCheck size={20} strokeWidth={1.5} />
                <div>
                  <p>Easy Returns</p>
                  <span>7-day return policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
