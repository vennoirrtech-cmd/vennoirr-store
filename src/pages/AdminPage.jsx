import { useState, useRef, useEffect, useCallback } from "react";
import { useAdminProducts } from "../context/AdminProductContext";
import { Link } from "react-router-dom";
import {
  FiTrash2, FiUploadCloud, FiX, FiPlus, FiHome,
  FiLogOut, FiAlertCircle, FiLoader,
} from "react-icons/fi";
import { adminLogin, adminLogout, isAdminLoggedIn } from "../services/adminAuthService";
import { getCategories, createProduct, uploadProductImages } from "../services/productService";
import "../styles/AdminPage.css";

// ── Constants ─────────────────────────────────────────────────────────────────
const GENDERS = ["Men", "Women", "Unisex"];
const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  mrp: "",
  sku: "",
  gender: "Men",
  category: "",
  subCategory: "",
  stockQuantity: 10,
  sizes: ["M"],
  isNewArrival: true,
  isBestSeller: false,
  isTrending: false,
  brand: "VENNOIRR",
  gst: 5,
};

function generateSKU(name) {
  if (!name) return "";
  return name
    .toUpperCase()
    .replace(/[^A-Z0-9 ]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 20)
    + "-" + Date.now().toString().slice(-4);
}

// ── Admin Login Screen ────────────────────────────────────────────────────────
function AdminLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await adminLogin(email, password);
      onLoginSuccess();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-screen">
      <div className="admin-login-card">
        <div className="admin-logo" style={{ marginBottom: 24, justifyContent: "center" }}>
          <span className="logo-v">V</span>
          <span>ENNOIRR ADMIN</span>
        </div>
        <h2>Sign in to Dashboard</h2>
        {error && (
          <div className="admin-error">
            <FiAlertCircle /> {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@vennoirr.com"
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className="admin-submit-btn" disabled={loading}>
            {loading ? <><FiLoader className="spin" /> Signing in...</> : "Sign In"}
          </button>
        </form>
        <Link to="/" className="admin-back-link">← Back to Website</Link>
      </div>
    </div>
  );
}

// ── Main Admin Page ───────────────────────────────────────────────────────────
export default function AdminPage() {
  const { adminProducts, loadingProducts, notifyProductAdded, deleteAdminProduct } = useAdminProducts();

  const [loggedIn, setLoggedIn] = useState(isAdminLoggedIn());
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFiles, setImageFiles]   = useState([]);   // File objects for upload
  const [imagePreviews, setImagePreviews] = useState([]); // base64 previews for display

  const [dragging, setDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const fileInputRef = useRef(null);

  // ── Load categories when logged in ─────────────────────────────────────────
  const loadCategories = useCallback(async () => {
    try {
      const res = await getCategories();
      if (res.success) {
        const all = res.data ?? [];
        const topLevel = all.filter((c) => !c.parent);
        const subs = all.filter((c) => c.parent);
        setCategories(topLevel);
        setSubCategories(subs);
        if (topLevel.length > 0) {
          setForm((prev) => ({ ...prev, category: topLevel[0]._id }));
        }
      }
    } catch {
      // keep empty
    }
  }, []);

  useEffect(() => {
    if (loggedIn) loadCategories();
  }, [loggedIn, loadCategories]);

  const handleLoginSuccess = () => {
    setLoggedIn(true);
  };

  const handleLogout = () => {
    adminLogout();
    setLoggedIn(false);
  };

  // ── Image utilities ────────────────────────────────────────────────────────
  const processFiles = (files) => {
    const valid = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!valid.length) return;
    const remaining = 5 - imageFiles.length;
    const toAdd = valid.slice(0, remaining);

    toAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews((prev) => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
    setImageFiles((prev) => [...prev, ...toAdd]);
    setFieldErrors((prev) => ({ ...prev, images: "" }));
  };

  const handleFileInput = (e) => processFiles(e.target.files);
  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const removeImage = (idx) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== idx));
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  // ── Form handlers ──────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: type === "checkbox" ? checked : value };
      // Auto-generate SKU when name changes
      if (name === "name") {
        updated.sku = generateSKU(value);
      }
      return updated;
    });
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const toggleSize = (size) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Product name is required";
    if (!form.price || +form.price <= 0) e.price = "Valid price required";
    if (!form.mrp || +form.mrp <= 0) e.mrp = "Valid MRP required";
    if (!form.sku.trim()) e.sku = "SKU is required";
    if (!form.category) e.category = "Category is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (form.stockQuantity === "" || isNaN(form.stockQuantity) || +form.stockQuantity < 0) e.stockQuantity = "Valid stock required";
    if (form.gst === "" || isNaN(form.gst) || +form.gst < 0) e.gst = "Valid GST required";
    if (!form.sizes || form.sizes.length === 0) e.sizes = "At least one size is required";
    if (!imageFiles.length) e.images = "At least one image is required";
    return e;
  };

  // ── Submit (2-step: create product → upload images) ────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      // Step 1 — Create product (JSON, no images)
      const parsedStock = form.stockQuantity === "" ? 10 : Number(form.stockQuantity);
      const parsedGst = form.gst === "" ? 5 : Number(form.gst);
      
      const productPayload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: +form.price,
        mrp: +form.mrp,
        sku: form.sku.trim().toUpperCase(),
        gender: form.gender,
        category: form.category,
        subCategory: form.subCategory || undefined,
        stockQuantity: isNaN(parsedStock) ? 10 : parsedStock,
        sizes: form.sizes,
        isNewArrival: form.isNewArrival,
        isBestSeller: form.isBestSeller,
        isTrending: form.isTrending,
        brand: form.brand || "VENNOIRR",
        gst: isNaN(parsedGst) ? 5 : parsedGst,
      };

      const createRes = await createProduct(productPayload);
      const productId = createRes?.data?._id;

      if (!productId) throw new Error("Product creation failed — no product ID returned.");

      // Step 2 — Upload images to Cloudinary via backend
      await uploadProductImages(productId, imageFiles);

      // Done!
      setForm(EMPTY_FORM);
      setImageFiles([]);
      setImagePreviews([]);
      setFieldErrors({});
      setSuccess(true);
      notifyProductAdded();
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong. Please try again.";
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete product ─────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product? This cannot be undone.")) return;
    try {
      await deleteAdminProduct(id);
    } catch {
      alert("Failed to delete product.");
    }
  };

  // ── Show login wall if not authenticated ───────────────────────────────────
  if (!loggedIn) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  // ── Dashboard ──────────────────────────────────────────────────────────────
  return (
    <div className="admin-page">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <span className="logo-v">V</span>
          <span>ENNOIRR</span>
        </div>
        <nav className="admin-nav">
          <a className="admin-nav-item active" href="#add-product">
            <FiPlus /> Add Product
          </a>
          <a className="admin-nav-item" href="#products-list">
            <FiHome /> All Products
          </a>
        </nav>
        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
          <Link to="/" className="admin-visit-site">← Visit Site</Link>
          <button className="admin-logout-btn" onClick={handleLogout}>
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="admin-main">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <p>{adminProducts.length} product(s) in database</p>
        </div>

        {/* ── Add Product Form ── */}
        <section id="add-product" className="admin-card">
          <h2>Add New Product</h2>

          {success && (
            <div className="admin-success">
              ✓ Product published to MongoDB and will now appear on the website!
            </div>
          )}
          {submitError && (
            <div className="admin-error">
              <FiAlertCircle /> {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="admin-form" noValidate>

            {/* Images */}
            <div className="form-group full-width">
              <label>
                Product Images <span className="required">*</span>{" "}
                <em>(max 5 · 1st = main, 2nd = hover · uploaded to Cloudinary)</em>
              </label>
              <div
                className={`image-dropzone ${dragging ? "dragging" : ""} ${fieldErrors.images ? "has-error" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <FiUploadCloud size={36} />
                <p>Drag &amp; drop images here, or <strong>click to browse</strong></p>
                <span className="dropzone-hint">PNG, JPG, WebP · max 5MB each · max 5 images</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={handleFileInput}
                />
              </div>
              {fieldErrors.images && <span className="field-error">{fieldErrors.images}</span>}

              {imagePreviews.length > 0 && (
                <div className="image-previews">
                  {imagePreviews.map((src, i) => (
                    <div key={i} className="preview-thumb">
                      <img src={src} alt={`preview-${i}`} />
                      {i === 0 && <span className="thumb-badge">Main</span>}
                      {i === 1 && <span className="thumb-badge hover">Hover</span>}
                      <button
                        type="button"
                        className="remove-thumb"
                        onClick={() => removeImage(i)}
                        aria-label="Remove"
                      >
                        <FiX />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Name */}
            <div className="form-group">
              <label>Product Name <span className="required">*</span></label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Route 66 Graphic Tee"
                className={fieldErrors.name ? "has-error" : ""}
              />
              {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
            </div>

            {/* SKU */}
            <div className="form-group">
              <label>SKU <span className="required">*</span> <em>(auto-generated)</em></label>
              <input
                type="text"
                name="sku"
                value={form.sku}
                onChange={handleChange}
                placeholder="ROUTE-66-TEE-1234"
                className={fieldErrors.sku ? "has-error" : ""}
              />
              {fieldErrors.sku && <span className="field-error">{fieldErrors.sku}</span>}
            </div>

            {/* Description */}
            <div className="form-group full-width">
              <label>Description <span className="required">*</span></label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="Describe the product..."
                className={fieldErrors.description ? "has-error" : ""}
              />
              {fieldErrors.description && <span className="field-error">{fieldErrors.description}</span>}
            </div>

            {/* Sale Price */}
            <div className="form-group">
              <label>Sale Price (₹) <span className="required">*</span></label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="1499"
                min="0"
                className={fieldErrors.price ? "has-error" : ""}
              />
              {fieldErrors.price && <span className="field-error">{fieldErrors.price}</span>}
            </div>

            {/* MRP */}
            <div className="form-group">
              <label>MRP (₹) <span className="required">*</span></label>
              <input
                type="number"
                name="mrp"
                value={form.mrp}
                onChange={handleChange}
                placeholder="2499"
                min="0"
                className={fieldErrors.mrp ? "has-error" : ""}
              />
              {fieldErrors.mrp && <span className="field-error">{fieldErrors.mrp}</span>}
            </div>

            {/* Gender */}
            <div className="form-group">
              <label>Gender <span className="required">*</span></label>
              <select name="gender" value={form.gender} onChange={handleChange}>
                {GENDERS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div className="form-group">
              <label>Category <span className="required">*</span></label>
              {categories.length === 0 ? (
                <div className="field-hint">No categories found — add some via the API first.</div>
              ) : (
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className={fieldErrors.category ? "has-error" : ""}
                >
                  <option value="">— Select category —</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              )}
              {fieldErrors.category && <span className="field-error">{fieldErrors.category}</span>}
            </div>

            {/* Sub-Category */}
            {subCategories.length > 0 && (
              <div className="form-group">
                <label>Sub-Category</label>
                <select name="subCategory" value={form.subCategory} onChange={handleChange}>
                  <option value="">— None —</option>
                  {subCategories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Stock */}
            <div className="form-group">
              <label>Stock Quantity</label>
              <input
                type="number"
                name="stockQuantity"
                value={form.stockQuantity}
                onChange={handleChange}
                min="0"
                placeholder="10"
                className={fieldErrors.stockQuantity ? "has-error" : ""}
              />
              {fieldErrors.stockQuantity && <span className="field-error">{fieldErrors.stockQuantity}</span>}
            </div>

            {/* Sizes */}
            <div className="form-group full-width">
              <label>Available Sizes</label>
              <div className="size-chips">
                {SIZE_OPTIONS.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`size-chip ${form.sizes.includes(size) ? "active" : ""}`}
                    onClick={() => toggleSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {fieldErrors.sizes && <span className="field-error">{fieldErrors.sizes}</span>}
            </div>

            {/* Flags */}
            <div className="form-group">
              <label className="checkbox-label">
                <input type="checkbox" name="isNewArrival" checked={form.isNewArrival} onChange={handleChange} />
                Mark as <strong>New Arrival</strong>
              </label>
            </div>
            <div className="form-group">
              <label className="checkbox-label">
                <input type="checkbox" name="isBestSeller" checked={form.isBestSeller} onChange={handleChange} />
                Mark as <strong>Best Seller</strong>
              </label>
            </div>
            <div className="form-group">
              <label className="checkbox-label">
                <input type="checkbox" name="isTrending" checked={form.isTrending} onChange={handleChange} />
                Mark as <strong>Trending</strong>
              </label>
            </div>

            <div className="form-group full-width">
              <button type="submit" className="admin-submit-btn" disabled={submitting}>
                {submitting
                  ? <><FiLoader className="spin" /> Publishing — uploading images...</>
                  : <><FiPlus /> Publish Product to Website</>}
              </button>
            </div>
          </form>
        </section>

        {/* ── Products List ── */}
        <section id="products-list" className="admin-card">
          <h2>
            All Products ({loadingProducts ? "loading…" : adminProducts.length})
          </h2>
          {loadingProducts && <p className="loading-hint">Fetching from MongoDB…</p>}
          {!loadingProducts && adminProducts.length === 0 && (
            <p className="loading-hint">No products in the database yet.</p>
          )}
          <div className="admin-product-list">
            {adminProducts.map((p) => {
              const id = p._id || p.id;
              const imgSrc = p.images?.[0]?.url || p.image || "";
              return (
                <div key={id} className="admin-product-row">
                  <div className="admin-product-img">
                    {imgSrc
                      ? <img src={imgSrc} alt={p.name || p.title} />
                      : <span className="no-img">No img</span>}
                  </div>
                  <div className="admin-product-info">
                    <strong>{p.name || p.title}</strong>
                    <span>₹{p.price} {p.mrp ? `/ MRP ₹${p.mrp}` : ""}</span>
                    <span className="product-meta">
                      {p.gender && <em className="tag">{p.gender}</em>}
                      {p.isNewArrival && <em className="tag new">New</em>}
                      {p.isBestSeller && <em className="tag best">Best Seller</em>}
                      {p.isTrending && <em className="tag trend">Trending</em>}
                    </span>
                  </div>
                  <button
                    className="admin-delete-btn"
                    onClick={() => handleDelete(id)}
                    aria-label="Delete"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
