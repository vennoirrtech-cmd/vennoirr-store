import React, { useState, useEffect } from "react";
import { FiPackage, FiMapPin, FiUser, FiLogOut } from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getMyOrders } from "../services/orderService";
import api from "../services/authService";
import "../styles/Account.css";

export default function Account() {
  const { user, jwt, loginAuth, logoutAuth } = useAuth();
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [savingProfile, setSavingProfile] = useState(false);

  // Sync form when user data changes (must be before any early return)
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  // Fetch orders whenever the orders tab is active
  useEffect(() => {
    if (activeTab !== "orders" || !user) return;
    let cancelled = false;
    setLoadingOrders(true);
    getMyOrders()
      .then((res) => {
        if (!cancelled && res?.success) setOrders(res.data || []);
      })
      .catch((err) => console.error("Failed to fetch orders", err))
      .finally(() => {
        if (!cancelled) setLoadingOrders(false);
      });
    return () => {
      cancelled = true;
    };
  }, [activeTab, user]);

  // Auth guard — after all hooks
  if (!user) return <Navigate to="/" replace />;

  // ── Handlers ──────────────────────────────────────────────
  const handleProfileChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

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
      const payload = { name: formData.name.trim() };
      if (formData.email.trim()) payload.email = formData.email.trim();

      const res = await api.put("/api/v1/auth/profile", payload);
      if (res.data?.success) {
        loginAuth(jwt, res.data.data);
        toast.success("Profile updated successfully!");
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to update profile. Please try again."
      );
    } finally {
      setSavingProfile(false);
    }
  };

  // ── Helpers ────────────────────────────────────────────────
  const initials =
    user?.name
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "VR";

  const tabs = [
    { id: "orders",  icon: <FiPackage />, label: "Order History"  },
    { id: "address", icon: <FiMapPin />,  label: "Shipping Address" },
    { id: "details", icon: <FiUser />,    label: "Edit Profile"  },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "orders":
        return (
          <div>
            <h3 className="account-tab-title">Order History</h3>
            {loadingOrders ? (
              <p className="empty-message">Loading orders…</p>
            ) : orders.length === 0 ? (
              <p className="empty-message">You haven&apos;t placed any orders yet.</p>
            ) : (
              <div className="orders-list">
                {orders.map((order) => (
                  <div key={order._id} className="order-row">
                    <div className="order-row-left">
                      <p className="order-row-num">#{order.orderNumber}</p>
                      <p className="order-row-meta">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit", month: "short", year: "numeric",
                        })}{" "}
                        · {order.items?.length || 0} item
                        {order.items?.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="order-row-right">
                      <span
                        className="order-status-badge"
                        data-status={order.orderStatus}
                      >
                        {order.orderStatus?.toUpperCase()}
                      </span>
                      <p className="order-row-amount">
                        ₹{(order.totalAmount || 0).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "address":
        return (
          <div>
            <h3 className="account-tab-title">Shipping Address</h3>
            <p className="empty-message">No shipping addresses saved.</p>
          </div>
        );

      case "details":
        return (
          <div>
            <h3 className="account-tab-title">Edit Profile</h3>
            <form className="profile-edit-form" onSubmit={handleProfileSave}>
              <div className="account-field-group">
                <label htmlFor="acc-name">Full Name</label>
                <input
                  id="acc-name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleProfileChange}
                  placeholder="Enter your full name"
                  autoComplete="name"
                />
              </div>
              <div className="account-field-group">
                <label htmlFor="acc-email">Email Address</label>
                <input
                  id="acc-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleProfileChange}
                  placeholder="Enter your email address"
                  autoComplete="email"
                />
              </div>
              <div className="account-field-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={user?.phone || "—"}
                  disabled
                  className="input-disabled"
                />
                <p className="field-note">
                  Phone number is linked to your OTP login and cannot be changed.
                </p>
              </div>
              <button
                type="submit"
                className="profile-save-btn"
                disabled={savingProfile}
              >
                {savingProfile ? "Saving…" : "Save Changes"}
              </button>
            </form>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="account-container">
      <div className="account-card">
        {/* Sidebar */}
        <div className="account-sidebar">
          <div className="account-identity">
            <div className="account-avatar">{initials}</div>
            <p className="account-name">{user?.name || "VENNOIRR USER"}</p>
            <p className="account-contact">{user?.email || user?.phone || "—"}</p>
          </div>

          <ul>
            {tabs.map((tab) => (
              <li
                key={tab.id}
                className={activeTab === tab.id ? "active" : ""}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="sidebar-icon">{tab.icon}</span>
                {tab.label}
              </li>
            ))}
            <li className="logout-button" onClick={logoutAuth}>
              <span className="sidebar-icon"><FiLogOut /></span>
              Log out
            </li>
          </ul>
        </div>

        {/* Content */}
        <div className="account-content">{renderContent()}</div>
      </div>
    </div>
  );
}
