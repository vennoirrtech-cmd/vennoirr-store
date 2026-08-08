import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { getMyOrders } from "../services/orderService";
import { AuthContext } from "../context/AuthContext";
import api from "../services/authService";
import { toast } from "react-hot-toast";
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
    { id: "orders", label: "Orders", icon: "📦" },
    { id: "profile", label: "Edit Profile", icon: "✏️" },
    { id: "wishlist", label: "Wishlist", icon: "♡", to: "/wishlist" },
  ];

  return (
    <main style={{ paddingTop: "calc(var(--ticker-height) + var(--navbar-height))", minHeight: "80vh" }}>
      <div className="container" style={{ paddingTop: 48, paddingBottom: 60, maxWidth: 960, margin: "0 auto" }}>
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
                      <button className="order-detail-btn">View Order Details →</button>
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
