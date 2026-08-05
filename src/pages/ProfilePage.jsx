import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { getMyOrders } from "../services/orderService";
import { AuthContext } from "../context/AuthContext";

export default function ProfilePage() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

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
  }, [user]);
  return (
    <main style={{ paddingTop: "calc(var(--ticker-height) + var(--navbar-height))", minHeight: "80vh" }}>
      <div className="container" style={{ paddingTop: 48, paddingBottom: 60, maxWidth: 900, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 40, borderBottom: "1px solid var(--grey-200)", paddingBottom: 28 }}>
          <p style={{ fontSize: 11, letterSpacing: "0.4em", textTransform: "uppercase", color: "var(--grey-400)", marginBottom: 8 }}>Welcome back</p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px,5vw,64px)", fontWeight: 900, textTransform: "uppercase", letterSpacing: 3 }}>
            My Account
          </h1>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 40 }}>

          {/* Sidebar */}
          <div>
            <div style={{ background: "var(--black)", color: "var(--white)", padding: 28, marginBottom: 20 }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--red)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, marginBottom: 16 }}>
                VR
              </div>
              <p style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 16, letterSpacing: 1, marginBottom: 4 }}>{user?.name || "VENNOIRR USER"}</p>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{user?.email}</p>
            </div>

            <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {[
                { label: "Orders", icon: "📦" },
                { label: "Wishlist", icon: "♡", to: "/wishlist" },
                { label: "Addresses", icon: "📍" },
                { label: "Settings", icon: "⚙️" },
              ].map(item => (
                <Link
                  key={item.label}
                  to={item.to || "#"}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "13px 16px", fontSize: 13, letterSpacing: 0.5, fontFamily: "var(--font-heading)", fontWeight: 600, background: "var(--grey-100)", borderLeft: "3px solid transparent", color: "var(--black)", transition: "all 0.2s" }}
                >
                  <span>{item.icon}</span> {item.label.toUpperCase()}
                </Link>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 14, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", marginBottom: 20 }}>
              Recent Orders
            </h2>

            {loadingOrders ? (
              <p>Loading orders...</p>
            ) : orders.length === 0 ? (
              <p style={{ color: "var(--grey-500)", fontStyle: "italic" }}>You have no recent orders.</p>
            ) : (
              orders.map(order => (
                <div key={order._id} style={{ border: "1px solid var(--grey-200)", marginBottom: 16, padding: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                    <div>
                      <p style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 14, letterSpacing: 0.5 }}>#{order.orderNumber}</p>
                      <p style={{ fontSize: 12, color: "var(--grey-400)", marginTop: 4 }}>{new Date(order.createdAt).toLocaleDateString()} · {order.items?.length || 0} items</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{
                        display: "inline-block", padding: "4px 12px", fontSize: 11, fontWeight: 700, letterSpacing: 0.5, fontFamily: "var(--font-heading)",
                        background: order.orderStatus === "Delivered" ? "#1a3d1a" : "#1a2a3d",
                        color: order.orderStatus === "Delivered" ? "#4caf50" : "#64b5f6",
                      }}>
                        {order.orderStatus.toUpperCase()}
                      </span>
                      <p style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 15, marginTop: 8 }}>₹{order.totalAmount?.toLocaleString("en-IN") || order.totalAmount}</p>
                    </div>
                  </div>
                  <button style={{ fontSize: 12, color: "var(--grey-500)", letterSpacing: 0.5, textDecoration: "underline", background: "none", border: "none", cursor: "pointer" }}>
                    View Order Details →
                  </button>
                </div>
              ))
            )}

            <div style={{ marginTop: 32, padding: 24, background: "var(--grey-100)" }}>
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: 13, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 16 }}>Account Settings</h3>
              <div style={{ display: "grid", gap: 12 }}>
                {["Full Name", "Email Address", "Phone Number"].map(field => (
                  <div key={field}>
                    <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "var(--grey-500)", display: "block", marginBottom: 4, fontFamily: "var(--font-heading)" }}>{field}</label>
                    <input
                      placeholder={`Enter your ${field.toLowerCase()}`}
                      style={{ width: "100%", padding: "11px 14px", border: "1px solid var(--grey-300)", fontSize: 13, fontFamily: "var(--font-body)", background: "var(--white)" }}
                    />
                  </div>
                ))}
              </div>
              <button style={{ marginTop: 16, padding: "12px 32px", background: "var(--black)", color: "var(--white)", fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 12, letterSpacing: 2, textTransform: "uppercase" }}>
                SAVE CHANGES
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
