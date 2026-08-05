import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { getAddresses, createAddress } from "../services/addressService";
import { createOrder, createRazorpayOrder, verifyPayment } from "../services/orderService";
import { toast } from "react-hot-toast";

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

  const handleCheckout = async () => {
    if (!selectedAddressId) {
      toast.error("Please select or add a delivery address.");
      return;
    }

    setIsProcessing(true);
    try {
      // 1. Create order on backend
      const orderRes = await createOrder({
        addressId: selectedAddressId,
        paymentMode: "Online",
        couponCode: ""
      });

      if (!orderRes.success) throw new Error(orderRes.message);
      const orderData = orderRes.data;

      // 2. Initialize Razorpay Payment Order
      const rzpRes = await createRazorpayOrder(orderData._id);
      if (!rzpRes.success) throw new Error(rzpRes.message);
      
      const rzpData = rzpRes.data;

      // 3. Setup Razorpay Modal Options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || rzpData.key_id,
        // Backend returns totalAmount in INR; Razorpay SDK needs paise (×100)
        amount: Math.round((rzpData.amount || orderData.totalAmount) * 100),
        currency: "INR",
        name: "VENNOIRR",
        description: "Order #" + orderData.orderNumber,
        order_id: rzpData.razorpayOrderId,
        handler: async function (response) {
          try {
            // 4. Verify Payment
            const verifyRes = await verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            });
            if (verifyRes.success) {
              toast.success("Payment Successful! Order Confirmed.");
              clearCart();
              navigate("/"); // Smooth SPA redirect
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
        theme: {
          color: "#000000"
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (){
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

  const subtotal = cartTotal;
  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  return (
    <div className="checkout-page" style={{ paddingTop: '100px', minHeight: '80vh', padding: '100px 5%' }}>
      <h2 style={{ marginBottom: '30px' }}>Checkout</h2>
      
      <div className="checkout-layout" style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        <div className="checkout-address-section" style={{ flex: '1 1 60%' }}>
          <h3>Delivery Address</h3>
          
          {addresses.map(addr => (
            <div key={addr._id} className="address-card" style={{ border: selectedAddressId === addr._id ? '2px solid black' : '1px solid #ddd', padding: '15px', marginBottom: '15px', cursor: 'pointer', borderRadius: '4px' }} onClick={() => setSelectedAddressId(addr._id)}>
              <h4>{addr.name} - {addr.mobile}</h4>
              <p>{addr.houseNo}, {addr.area}</p>
              <p>{addr.city}, {addr.state} - {addr.pincode}</p>
            </div>
          ))}

          {!showAddressForm ? (
            <button onClick={() => setShowAddressForm(true)} className="shop-btn" style={{ background: '#fff', color: '#000', border: '1px solid #000', padding: '10px 20px', cursor: 'pointer' }}>+ Add New Address</button>
          ) : (
            <form onSubmit={handleAddressSubmit} style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '4px', marginTop: '20px' }}>
              <h4>Add New Address</h4>
              <div className="checkout-address-form-grid">
                <input required type="text" placeholder="Full Name" value={addressData.name} onChange={e => setAddressData({...addressData, name: e.target.value})} className="auth-input" />
                <input required type="tel" placeholder="Mobile" value={addressData.mobile} onChange={e => setAddressData({...addressData, mobile: e.target.value})} className="auth-input" />
                <input required type="text" placeholder="House No / Building" value={addressData.houseNo} onChange={e => setAddressData({...addressData, houseNo: e.target.value})} className="auth-input" />
                <input required type="text" placeholder="Area / Street" value={addressData.area} onChange={e => setAddressData({...addressData, area: e.target.value})} className="auth-input" />
                <input required type="text" placeholder="City" value={addressData.city} onChange={e => setAddressData({...addressData, city: e.target.value})} className="auth-input" />
                <input required type="text" placeholder="Pincode (6 digits)" value={addressData.pincode} onChange={e => setAddressData({...addressData, pincode: e.target.value})} className="auth-input" />
              </div>
              <button type="submit" className="shop-btn" style={{ marginTop: '20px' }}>Save Address</button>
              <button type="button" onClick={() => setShowAddressForm(false)} style={{ background: 'none', border: 'none', textDecoration: 'underline', marginLeft: '15px', cursor: 'pointer' }}>Cancel</button>
            </form>
          )}
        </div>

        <div className="checkout-summary-section" style={{ flex: '1 1 30%', background: '#f9f9f9', padding: '25px', height: 'fit-content', borderRadius: '4px' }}>
          <h3>Order Summary</h3>
          <div style={{ margin: '20px 0' }}>
            {cart.map(item => (
              <div key={item._id || item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>{item.title || item.name} (x{item.qty}) - {item.size}</span>
                <span>₹{item.price * item.qty}</span>
              </div>
            ))}
          </div>
          <hr style={{ borderTop: '1px solid #ddd' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
            <span>Shipping</span>
            <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', fontWeight: 'bold', fontSize: '1.2rem' }}>
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <div style={{ marginTop: '20px', display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.9rem', color: '#555' }}>
            <input 
              type="checkbox" 
              id="terms_agree" 
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              style={{ marginTop: '4px', cursor: 'pointer' }}
            />
            <label htmlFor="terms_agree" style={{ cursor: 'pointer' }}>
              I agree to the <a href="/terms" target="_blank" style={{ color: '#000', textDecoration: 'underline' }}>Terms & Conditions</a>, <a href="/privacy" target="_blank" style={{ color: '#000', textDecoration: 'underline' }}>Privacy Policy</a>, and <a href="/returns" target="_blank" style={{ color: '#000', textDecoration: 'underline' }}>Return Policy</a>.
            </label>
          </div>

          <button 
            className="checkout-btn shop-btn" 
            style={{ width: '100%', marginTop: '20px', padding: '15px', background: '#000', color: '#fff', fontWeight: 'bold', fontSize: '1rem', border: 'none', cursor: 'pointer' }} 
            onClick={handleCheckout}
            disabled={isProcessing || (addresses.length === 0 && !selectedAddressId) || !agreedToTerms}
          >
            {isProcessing ? "PROCESSING..." : "PROCEED TO PAYMENT"}
          </button>
        </div>
      </div>
      <style>{`
        .checkout-layout {
          display: flex;
          gap: 30px;
          flex-wrap: wrap;
        }
        .checkout-address-section, .checkout-summary-section {
          flex: 1 1 100%;
        }
        @media (min-width: 768px) {
          .checkout-address-section { flex: 1 1 60%; }
          .checkout-summary-section { flex: 1 1 30%; }
        }
        .checkout-address-form-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 15px;
          margin-top: 20px;
        }
        @media (min-width: 600px) {
          .checkout-address-form-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        .checkout-address-form-grid input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        .checkout-btn { transition: opacity 0.3s }
        .checkout-btn:hover:not(:disabled) { opacity: 0.9 }
        .checkout-btn:disabled {
          background: #555 !important;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
