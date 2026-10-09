import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { getAddresses, createAddress } from "../services/addressService";
import { createOrder, createRazorpayOrder, verifyPayment } from "../services/orderService";
import { optimizeImage } from "../utils/imageOptimization";
import { toast } from "react-hot-toast";
import { Helmet } from "react-helmet-async";
import { LuCreditCard, LuBanknote, LuLock } from "react-icons/lu";

export default function CheckoutPage() {
  const { cart, cartTotal, loading, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressData, setAddressData] = useState({
    name: "", mobile: "", houseNo: "", area: "", city: "Nagpur", state: "Maharashtra", pincode: ""
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [paymentMode, setPaymentMode] = useState("Online"); // "Online" | "COD"

  useEffect(() => {
    if (!user) {
      toast.error("Please login to access checkout");
      navigate("/");
      return;
    }
    if (cart.length === 0 && !loading) {
      navigate("/cart");
      return;
    }
    fetchAddresses();
    loadRazorpayScript();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadRazorpayScript = () => {
    // Prevent duplicate injection
    if (document.querySelector('script[src*="razorpay"]')) return;
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);
  };

  const fetchAddresses = async () => {
    try {
      const res = await getAddresses();
      if (res.success && res.data?.length > 0) {
        setAddresses(res.data);
        const defaultAddr = res.data.find((a) => a.isDefault) || res.data[0];
        setSelectedAddressId(defaultAddr._id);
      } else {
        setShowAddressForm(true);
      }
    } catch (err) {
      console.error("Fetch Addresses Error", err);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createAddress(addressData);
      if (res.success) {
        toast.success("Address added");
        setAddresses([...addresses, res.data]);
        setSelectedAddressId(res.data._id);
        setShowAddressForm(false);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to add address.");
    }
  };

  const handleCODCheckout = async () => {
    if (!selectedAddressId) {
      toast.error("Please select or add a delivery address.");
      return;
    }
    setIsProcessing(true);
    try {
      const orderRes = await createOrder({
        addressId: selectedAddressId,
        paymentMode: "COD",
        couponCode: "",
        items: cart // Force inject exact client-side cart
      });
      if (!orderRes.success) throw new Error(orderRes.message);
      toast.success("Order placed! Cash on Delivery selected.");
      clearCart();
      navigate("/order-success", {
        state: { orderNumber: orderRes.data?.orderNumber, items: cart }
      });
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to place COD order");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOnlineCheckout = async () => {
    if (!selectedAddressId) {
      toast.error("Please select or add a delivery address.");
      return;
    }
    setIsProcessing(true);
    try {
      const orderRes = await createOrder({
        addressId: selectedAddressId,
        paymentMode: "Online",
        couponCode: "",
        items: cart
      });
      if (!orderRes.success) throw new Error(orderRes.message);
      const orderData = orderRes.data;

      const rzpRes = await createRazorpayOrder(orderData._id);
      if (!rzpRes.success) throw new Error(rzpRes.message);

      const rzpData = rzpRes.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || rzpData.key_id,
        amount: Math.round((rzpData.amount || orderData.totalAmount) * 100),
        currency: "INR",
        name: "VENNOIRR",
        description: "Order #" + orderData.orderNumber,
        order_id: rzpData.razorpayOrderId,
        handler: async function (response) {
          try {
            const verifyRes = await verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            });
            if (verifyRes.success) {
              toast.success("Payment Successful! Order Confirmed.");
              clearCart();
              navigate("/order-success", {
                state: { orderNumber: orderData.orderNumber, items: cart }
              });
            } else {
              toast.error("Payment verification failed.");
            }
          } catch {
            toast.error("Something went wrong during verification");
          }
        },
        prefill: {
          name: user?.name || "Customer",
          email: user?.email || "customer@vennoirr.com",
          contact: user?.mobile || "",
        },
        theme: { color: "#000000" },
        modal: {
          ondismiss: function () {
            toast.error("Payment cancelled or closed. Your order is saved, you can pay later from your account.");
            // Redirect to Orders because Order is already created in DB
            setTimeout(() => {
              navigate("/profile?tab=orders");
            }, 2000);
          }
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on("payment.failed", function () {
        toast.error("Payment failed. Please try again.");
      });
      rzp1.open();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || err?.message || "Error creating order");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCheckout = () => {
    if (!agreedToTerms) {
      toast.error("Please agree to Terms & Conditions to proceed.");
      return;
    }
    if (paymentMode === "COD") {
      handleCODCheckout();
    } else {
      handleOnlineCheckout();
    }
  };

  const subtotal = cartTotal;
  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  return (
    <div className="checkout-page">
      <Helmet>
        <title>Checkout | Vennoirr</title>
      </Helmet>

      <h2 className="checkout-heading">Checkout</h2>

      <div className="checkout-layout">
        {/* LEFT: ADDRESS */}
        <div className="checkout-address-section">
          <h3>Delivery Address</h3>

          {addresses.map(addr => (
            <div
              key={addr._id}
              className={`address-card ${selectedAddressId === addr._id ? "address-card--selected" : ""}`}
              onClick={() => setSelectedAddressId(addr._id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && setSelectedAddressId(addr._id)}
            >
              <h4>{addr.name} — {addr.mobile}</h4>
              <p>{addr.houseNo}, {addr.area}</p>
              <p>{addr.city}, {addr.state} — {addr.pincode}</p>
            </div>
          ))}

          {!showAddressForm ? (
            <button onClick={() => setShowAddressForm(true)} className="checkout-add-addr-btn">
              + Add New Address
            </button>
          ) : (
            <form onSubmit={handleAddressSubmit} className="address-form">
              <h4>Add New Address</h4>
              <div className="checkout-address-form-grid">
                <div>
                  <label htmlFor="co_name" className="sr-only">Full Name</label>
                  <input id="co_name" required type="text" placeholder="Full Name" value={addressData.name} onChange={e => setAddressData({ ...addressData, name: e.target.value })} className="auth-input" aria-label="Full Name" />
                </div>
                <div>
                  <label htmlFor="co_mobile" className="sr-only">Mobile</label>
                  <input id="co_mobile" required type="tel" placeholder="Mobile" value={addressData.mobile} onChange={e => setAddressData({ ...addressData, mobile: e.target.value })} className="auth-input" aria-label="Mobile number" />
                </div>
                <div>
                  <label htmlFor="co_house" className="sr-only">House No / Building</label>
                  <input id="co_house" required type="text" placeholder="House No / Building" value={addressData.houseNo} onChange={e => setAddressData({ ...addressData, houseNo: e.target.value })} className="auth-input" aria-label="House number or building" />
                </div>
                <div>
                  <label htmlFor="co_area" className="sr-only">Area / Street</label>
                  <input id="co_area" required type="text" placeholder="Area / Street" value={addressData.area} onChange={e => setAddressData({ ...addressData, area: e.target.value })} className="auth-input" aria-label="Area or street" />
                </div>
                <div>
                  <label htmlFor="co_city" className="sr-only">City</label>
                  <input id="co_city" required type="text" placeholder="City" value={addressData.city} onChange={e => setAddressData({ ...addressData, city: e.target.value })} className="auth-input" aria-label="City" />
                </div>
                <div>
                  <label htmlFor="co_pincode" className="sr-only">Pincode</label>
                  <input id="co_pincode" required type="text" placeholder="Pincode (6 digits)" value={addressData.pincode} onChange={e => setAddressData({ ...addressData, pincode: e.target.value })} className="auth-input" aria-label="Pincode" />
                </div>
              </div>
              <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
                <button type="submit" className="shop-btn">Save Address</button>
                <button type="button" className="checkout-cancel-btn" onClick={() => setShowAddressForm(false)}>Cancel</button>
              </div>
            </form>
          )}

          {/* PAYMENT METHOD TOGGLE */}
          <div className="payment-method-section">
            <h3>Payment Method</h3>
            <div className="payment-method-options">
              <label className={`payment-option ${paymentMode === "Online" ? "payment-option--active" : ""}`}>
                <input
                  type="radio"
                  name="paymentMode"
                  value="Online"
                  checked={paymentMode === "Online"}
                  onChange={() => setPaymentMode("Online")}
                />
                <span className="payment-option-icon"><LuCreditCard size={20} strokeWidth={1.5} /></span>
                <div>
                  <strong>Online Payment</strong>
                  <p>UPI, Cards, Net Banking via Razorpay</p>
                </div>
              </label>

              <label className={`payment-option ${paymentMode === "COD" ? "payment-option--active" : ""}`}>
                <input
                  type="radio"
                  name="paymentMode"
                  value="COD"
                  checked={paymentMode === "COD"}
                  onChange={() => setPaymentMode("COD")}
                />
                <span className="payment-option-icon"><LuBanknote size={20} strokeWidth={1.5} /></span>
                <div>
                  <strong>Cash on Delivery</strong>
                  <p>Pay when your order arrives</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* RIGHT: SUMMARY */}
        <div className="checkout-summary-section">
          <h3>Order Summary</h3>
          <div className="checkout-items-grid">
            {cart.map(item => (
              <div key={item._id || item.id} className="checkout-item-mini">
                <div className="checkout-item-img">
                  {(item.image || item.images?.length > 0) ? (
                    <img src={optimizeImage(item.image || item.images?.[0]?.url || item.images?.[0] || "", 400)} alt={item.title || item.name} loading="lazy" />
                  ) : (
                    <div className="img-placeholder"></div>
                  )}
                </div>
                <div className="checkout-item-info">
                  <p className="checkout-item-name">{item.title || item.name}</p>
                  <p className="checkout-item-meta">Size: {item.size} • Color: {item.color}</p>
                  <p className="checkout-item-qty">Qty: {item.quantity || item.qty}</p>
                </div>
                <div className="checkout-item-price">
                  ₹{item.price * (item.quantity || item.qty)}
                </div>
              </div>
            ))}
          </div>
          <hr className="checkout-divider" />
          <div className="checkout-summary-row">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="checkout-summary-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
          </div>
          <div className="checkout-summary-row checkout-summary-total">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <div className="checkout-terms-row">
            <input
              type="checkbox"
              id="terms_agree"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
            />
            <label htmlFor="terms_agree">
              I agree to the{" "}
              <a href="/terms" target="_blank">Terms &amp; Conditions</a>,{" "}
              <a href="/privacy" target="_blank">Privacy Policy</a>, and{" "}
              <a href="/returns" target="_blank">Return Policy</a>.
            </label>
          </div>

          <button
            className="shop-btn checkout-place-btn"
            onClick={handleCheckout}
            disabled={isProcessing || !agreedToTerms}
          >
            {isProcessing ? "PROCESSING..." : paymentMode === "COD" ? "PLACE ORDER (COD)" : "PROCEED TO PAYMENT"}
          </button>

          <div className="checkout-trust" style={{ gap: '16px', display: 'flex', alignItems: 'center' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><LuLock size={14} /> Secure Checkout</span>
            <span>Razorpay Gateway</span>
          </div>
        </div>
      </div>
    </div>
  );
}
