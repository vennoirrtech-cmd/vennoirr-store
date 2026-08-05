import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../services/productService";
import imgWomen from "../assets/images/Product2 Back _page-0001.jpg";
import imgMen from "../assets/images/men_fornt_page-0001.jpg";

export default function ShopByGender() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await getCategories();
        if (res.success && res.data) {
          // Filter to only active categories
          const activeCats = res.data.filter(c => c.isActive);
          setCategories(activeCats);
        } else if (res.data) {
          const arr = Array.isArray(res.data) ? res.data : (res || []);
          setCategories(arr.filter(c => c.isActive !== false));
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  if (loading) {
    return <section className="gender-section"><div style={{padding: '2rem', textAlign: 'center'}}>Loading Categories...</div></section>;
  }

  // Fallback to mock data if no categories found to avoid breaking UI layout
  if (!categories || categories.length === 0) {
    return (
      <section className="gender-section">
        <Link to="/women" className="gender-card">
          <img src={imgWomen} alt="Women Collection" />
          <div className="gender-overlay">
            <h2>SHOP WOMEN</h2>
            <button className="explore-btn">EXPLORE</button>
          </div>
        </Link>
        <Link to="/men" className="gender-card">
          <img src={imgMen} alt="Men Collection" />
          <div className="gender-overlay">
            <h2>SHOP MEN</h2>
            <button className="explore-btn">EXPLORE</button>
          </div>
        </Link>
      </section>
    );
  }

  return (
    <section className="gender-section" style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(300px, 1fr))`, gap: '1rem', padding: '1rem' }}>
      {categories.map((cat) => (
        <Link to={`/${cat.slug}`} className="gender-card" key={cat._id} style={{ position: 'relative', overflow: 'hidden', height: '100%', minHeight: '400px' }}>
          <img 
            src={cat.image?.url || (cat.name.toLowerCase().includes('women') ? imgWomen : imgMen)} 
            alt={cat.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div className="gender-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem', textTransform: 'uppercase' }}>SHOP {cat.name}</h2>
            <button className="explore-btn" style={{ padding: '0.75rem 2rem', background: '#fff', color: '#000', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>EXPLORE</button>
          </div>
        </Link>
      ))}
    </section>
  );
}
