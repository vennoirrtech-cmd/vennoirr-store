import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "swiper/css";
import "swiper/css/navigation";
import ProductCard from "./ProductCard";

export default function ProductCarousel({ section }) {
  const { title, subtitle, ctaLabel, products, slug } = section || {};

  if (!products || products.length === 0) return null;

  return (
    <section className="product-carousel container">
      <div className="section-header-wrapper" style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "flex-start",
        marginBottom: "32px",
        paddingLeft: "0", /* Ensuring shared left margin */
      }}>
        {/* Left: Heading + Subtitle */}
        <div className="section-header-left" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <h1 style={{ 
            fontFamily: "var(--font-display)", 
            fontWeight: "800", 
            fontSize: "clamp(24px, 4vw, 36px)",
            letterSpacing: "2px",
            textTransform: "uppercase", 
            margin: 0,
            lineHeight: "1.1",
            marginBottom: "6px"
          }}>
            {title ? title.toUpperCase() : "NEW IN"}
          </h1>
          <p className="section-subheading" style={{ margin: 0, fontSize: "14px", color: "var(--color-text-secondary, #666)" }}>
             Architectural proportions. Heavyweight custom jersey.
          </p>
        </div>

        {/* Right: CTA Link + Controls, baseline aligned with heading */}
        {title?.toLowerCase() !== "new in" && (
          <div className="header-actions" style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "24px",
            marginTop: "4px" // Adjust vertical alignment manually to match H1 baseline visually if needed
          }}>
            {ctaLabel && (
              <Link 
                to="/products" 
                className="shop-link group" 
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  position: "relative",
                  textDecoration: "none",
                  fontWeight: "500",
                  color: "inherit",
                }}
              >
                <span className="shop-link-text">{ctaLabel}</span>
                <FiChevronRight size={16} className="shop-link-arrow" />
                <span className="shop-link-underline"></span>
              </Link>
            )}
            
            <div className="carousel-nav" style={{ display: "flex", gap: "8px" }}>
              <button className={`carousel-prev-${slug}`} aria-label={`Previous ${title}`} style={{
                background: "none", border: "none", cursor: "pointer", padding: "4px"
              }}>
                <FiChevronLeft size={24} />
              </button>
              <button className={`carousel-next-${slug}`} aria-label={`Next ${title}`} style={{
                background: "none", border: "none", cursor: "pointer", padding: "4px"
              }}>
                <FiChevronRight size={24} />
              </button>
            </div>
          </div>
        )}
      </div>

      <Swiper
        modules={[Navigation]}
        navigation={{
          prevEl: `.carousel-prev-${slug}`,
          nextEl: `.carousel-next-${slug}`,
        }}
        spaceBetween={24}
        slidesPerView={3.2}
        breakpoints={{
          0: { slidesPerView: 1.2, spaceBetween: 16 },
          600: { slidesPerView: 2.2, spaceBetween: 20 },
          1024: { slidesPerView: 3.2, spaceBetween: 24 },
          1400: { slidesPerView: 4.2, spaceBetween: 24 },
        }}
      >
        {products.map((product) => (
          <SwiperSlide key={product.id || product._id}>
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
