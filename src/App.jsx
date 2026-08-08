import { Routes, Route, useLocation } from "react-router-dom";
import { useState, Suspense, lazy } from "react";
import { Toaster } from "react-hot-toast";

import AnnouncementBar from "./components/AnnouncementBar";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppPopup from "./components/WhatsAppPopup";
import DeliveryPopup from "./components/DeliveryPopup";
import ScrollToTop from "./components/ScrollToTop";

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
const Contact = lazy(() => import("./pages/Contact"));

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
          <WhatsAppPopup />
          <ScrollToTop />
          <Navbar />
        </>
      )}

      <Suspense fallback={<div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/account" element={<Account />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/returns" element={<Returns />} />
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