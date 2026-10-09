import { Routes, Route, useLocation } from "react-router-dom";
import { useState, Suspense, lazy } from "react";
import { Toaster } from "react-hot-toast";

import AnnouncementBar from "./components/AnnouncementBar";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import DeliveryPopup from "./components/DeliveryPopup";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";

import { AdminProductProvider } from "./context/AdminProductContext";

// Lazy load pages for Code Splitting (SEO & Speed Trick)
const Home = lazy(() => import("./pages/Home"));
const CartPage = lazy(() => import("./pages/CartPage"));
const WishlistPage = lazy(() => import("./pages/WishlistPage"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Login = lazy(() => import("./pages/Login"));
const Account = lazy(() => import("./pages/Account"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess"));
const NotFound = lazy(() => import("./pages/NotFound"));
const About = lazy(() => import("./pages/About"));
const SearchResults = lazy(() => import("./pages/SearchResults"));

const Men = lazy(() => import("./pages/Men"));
const MenFunky = lazy(() => import("./pages/MenFunky"));
const MenPremium = lazy(() => import("./pages/MenPremium"));

const Women = lazy(() => import("./pages/Women"));
const WomenFunky = lazy(() => import("./pages/WomenFunky"));
const WomenPremium = lazy(() => import("./pages/WomenPremium"));

const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Returns = lazy(() => import("./pages/Returns"));
const Shipping = lazy(() => import("./pages/Shipping"));
const Contact = lazy(() => import("./pages/Contact"));

// Full-page shimmer skeleton for Suspense fallback
function PageSkeleton() {
  return (
    <div className="page-skeleton">
      <div className="page-skeleton-bar skeleton-pulse" />
      <div className="page-skeleton-hero skeleton-pulse" />
      <div className="page-skeleton-row">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton-card">
            <div className="skeleton-img skeleton-pulse" />
            <div className="skeleton-line skeleton-pulse" style={{ width: "70%", marginTop: 12 }} />
            <div className="skeleton-line skeleton-pulse" style={{ width: "40%", marginTop: 8 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function AppLayout() {
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <div className={!isAdmin && showAnnouncement ? "has-announcement" : ""}>
      <Toaster position="bottom-center" toastOptions={{ className: 'custom-toast', style: { borderRadius: '4px', background: '#333', color: '#fff' } }} />

      {!isAdmin && (
        <>
          <AnnouncementBar onClose={() => setShowAnnouncement(false)} />
          <DeliveryPopup />
          <ScrollToTop />
          <Navbar />
        </>
      )}

      <Suspense fallback={<PageSkeleton />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/account" element={<Account />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/about" element={<About />} />
          <Route path="/search" element={<SearchResults />} />

          {/* Protected routes */}
          <Route path="/checkout" element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute adminOnly>
              <AdminPage />
            </ProtectedRoute>
          } />

          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/returns" element={<Returns />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/men">
            <Route index element={<Men />} />
            <Route path="funky" element={<MenFunky />} />
            <Route path="premium" element={<MenPremium />} />
          </Route>

          <Route path="/women">
            <Route index element={<Women />} />
            <Route path="funky" element={<WomenFunky />} />
            <Route path="premium" element={<WomenPremium />} />
          </Route>

          {/* 404 catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      {!isAdmin && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AdminProductProvider>
      <AppLayout />
    </AdminProductProvider>
  );
}

export default App;