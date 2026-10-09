import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { getMyOrders } from "../services/orderService";
import { AuthContext } from "../context/AuthContext";
import api from "../services/authService";
import { toast } from "react-hot-toast";
import { LuPackage, LuUser, LuHeart, LuLogOut } from "react-icons/lu";
import "./ProfilePage.css";

export default function ProfilePage() {
  const { user, loginAuth, jwt } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");

  // Profile form state
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");

  // Populate form when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getMyOrders();
        if (res?.success) {
          setOrders(res.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoadingOrders(false);
      }
    };
    if (user) fetchOrders();
    else setLoadingOrders(false);
  }, [user]);

  const handleProfileChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setProfileSuccess("");
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    try {
      setSavingProfile(true);
      const updatePayload = { name: formData.name.trim() };
      if (formData.email.trim()) updatePayload.email = formData.email.trim();

      const res = await api.put("/api/v1/auth/profile", updatePayload);
      if (res.data?.success) {
        // Update profile in localStorage & context
        const updatedUser = res.data.data;
        loginAuth(jwt, updatedUser);
        setProfileSuccess("Profile updated successfully!");
        toast.success("Profile updated!");
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to update profile.";
      toast.error(msg);
    } finally {
      setSavingProfile(false);
    }
  };

  const initials =
    user?.name
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "VR";

  const navItems = [
    { id: "orders", label: "Orders", icon: <LuPackage size={16} strokeWidth={1.5} /> },
    { id: "profile", label: "Edit Profile", icon: <LuUser size={16} strokeWidth={1.5} /> },
    { id: "wishlist", label: "Wishlist", icon: <LuHeart size={16} strokeWidth={1.5} />, to: "/wishlist" },
  ];

  const handleLogout = () => {
    loginAuth("", null);
  };

  return (
    <main style={{ paddingTop: "calc(var(--ticker-height) + var(--navbar-height) + 40px)", minHeight: "80vh" }}>
      <div className="container" style={{ paddingBottom: 80, maxWidth: 1000, margin: "0 auto" }}>
        {/* Header */}
        <div className="profile-header">
          <p className="profile-eyebrow">Welcome back</p>
          <h1 className="profile-title">My Account</h1>
        </div>

        <div className="profile-layout">
          {/* Sidebar */}
          <aside className="profile-sidebar">
            <div className="profile-card">
              <div className="avatar">
                <span>{initials}</span>
              </div>
              <p className="profile-name">{user?.name || "VENNOIRR USER"}</p>
              <p className="profile-email">{user?.email || user?.phone || "—"}</p>
            </div>

            <nav className="profile-nav">
              {navItems.map((item) =>
                item.to ? (
                  <Link
                    key={item.id}
                    to={item.to}
                    className="profile-nav-item"
                  >
                    <span>{item.icon}</span>
                    <span>{item.label.toUpperCase()}</span>
                  </Link>
                ) : (
                  <button
                    key={item.id}
                    className={`profile-nav-item ${activeTab === item.id ? "active" : ""}`}
                    onClick={() => setActiveTab(item.id)}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label.toUpperCase()}</span>
                  </button>
                )
              )}
              <button
                className="profile-nav-item profile-logout-btn"
                onClick={handleLogout}
              >
                <span><LuLogOut size={16} strokeWidth={1.5} /></span>
                <span>LOGOUT</span>
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <div className="profile-content">
            {/* ---- ORDERS TAB ---- */}
            {activeTab === "orders" && (
              <section>
                <h2 className="content-title">Recent Orders</h2>
                {loadingOrders ? (
                  <p className="loading-text">Loading orders...</p>
                ) : orders.length === 0 ? (
                  <div className="empty-orders">
                    <p>📦</p>
                    <p>No orders yet. Start shopping!</p>
                    <Link to="/shop" className="shop-link">BROWSE COLLECTION →</Link>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div key={order._id} className="order-card">
                      <div className="order-card-top">
                        <div>
                          <p className="order-num">#{order.orderNumber}</p>
                          <p className="order-meta">
                            {new Date(order.createdAt).toLocaleDateString("en-IN", {
                              day: "2-digit", month: "short", year: "numeric",
                            })} · {order.items?.length || 0} item{order.items?.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <span
                            className="order-status"
                            data-status={order.orderStatus}
                          >
                            {order.orderStatus?.toUpperCase()}
                          </span>
                          <p className="order-amount">
                            ₹{(order.totalAmount || 0).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>

                      {/* ORDER ITEMS RENDER */}
                      <div className="order-items-grid">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="order-item-mini">
                            <div className="order-item-img">
                              {item.image ? (
                                <img src={item.image} alt={item.name} />
                              ) : (
                                <div className="img-placeholder"></div>
                              )}
                            </div>
                            <div className="order-item-info">
                              <p className="order-item-name">{item.name}</p>
                              <p className="order-item-meta">Size: {item.size} • Color: {item.color}</p>
                              <p className="order-item-qty">Qty: {item.quantity}</p>
                            </div>
                            <div className="order-item-price">
                              ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* ORDER TRACKING & SHIPPING DATA */}
                      {(order.orderStatus !== 'Pending' && order.orderStatus !== 'Cancelled' && order.shippingData?.awbNumber) && (
                        <div className="order-tracking-strip" style={{ marginTop: '16px', padding: '12px', background: 'var(--surface)', borderRadius: '4px', fontSize: '13px', border: '1px solid var(--border)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <strong style={{ display: 'block', color: 'var(--primary)' }}>Courier: {order.shippingData.courierPartner || 'Logistics'}</strong>
                              <span style={{ color: 'var(--text-muted)' }}>AWB: <span style={{ fontFamily: 'monospace' }}>{order.shippingData.awbNumber}</span></span>
                            </div>
                            {order.shippingData.trackingUrl && (
                              <a 
                                href={order.shippingData.trackingUrl} 
                                target="_blank" 
                                rel="noreferrer" 
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--brand)', textDecoration: 'none', fontWeight: 600 }}
                              >
                                🗺️ Track live
                              </a>
                            )}
                          </div>
                          {order.estimatedDeliveryTime && (
                            <p style={{ marginTop: '8px', color: 'var(--text-muted)' }}>Estimated Delivery: <strong>{order.estimatedDeliveryTime}</strong></p>
                          )}
                        </div>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
                        <button className="order-detail-btn" style={{ padding: '6px 12px', border: '1px solid var(--border)', background: 'transparent' }}>View Details</button>
                        {(order.orderStatus === 'Delivered' && order.refundStatus === 'Not Applicable') && (
                          <button className="order-detail-btn" style={{ padding: '6px 12px', border: '1px solid var(--ink)', background: 'var(--ink)', color: 'var(--surface)' }}>Return Item</button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </section>
            )}

            {/* ---- PROFILE TAB ---- */}
            {activeTab === "profile" && (
              <section>
                <h2 className="content-title">Edit Profile</h2>
                <form className="profile-form" onSubmit={handleProfileSave}>
                  <div className="form-group">
                    <label htmlFor="profile-name">Full Name</label>
                    <input
                      id="profile-name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleProfileChange}
                      placeholder="Enter your full name"
                      autoComplete="name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="profile-email">Email Address</label>
                    <input
                      id="profile-email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleProfileChange}
                      placeholder="Enter your email address"
                      autoComplete="email"
                    />
                  </div>

                  {/* Phone is read-only (comes from Firebase OTP) */}
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      value={user?.phone || "—"}
                      disabled
                      style={{ opacity: 0.55, cursor: "not-allowed" }}
                    />
                    <p className="field-hint">Phone number is linked to your OTP login and cannot be changed.</p>
                  </div>

                  {profileSuccess && (
                    <div className="success-banner">{profileSuccess}</div>
                  )}

                  <button
                    type="submit"
                    className="save-btn"
                    disabled={savingProfile}
                  >
                    {savingProfile ? "SAVING..." : "SAVE CHANGES"}
                  </button>
                </form>
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
