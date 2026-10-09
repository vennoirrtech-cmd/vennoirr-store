import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import './CategoryHeader.css';

export default function CategoryHeader({ title, breadcrumbList, image, images, description, count }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const renderBackground = () => {
    if (images && images.length > 0) {
      return (
        <Swiper
          modules={[Autoplay, EffectFade, Pagination]}
          effect="fade"
          loop={true}
          autoplay={{ delay: 4500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          speed={1200}
          className="category-header-swiper"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
        >
          {images.map((img, idx) => (
            <SwiperSlide key={idx}>
              <div style={{ width: '100%', height: '100%', backgroundImage: `url("${img}")`, backgroundSize: 'cover', backgroundPosition: 'center top' }}></div>
            </SwiperSlide>
          ))}
        </Swiper>
      );
    }
    return (
      <div style={{ backgroundImage: `url("${image}")`, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, backgroundSize: 'cover', backgroundPosition: 'center top' }}></div>
    );
  };

  return (
    <div className="category-header-container">
      <div className="category-hero-static" style={{ position: 'relative', overflow: 'hidden' }}>
        {renderBackground()}
        <div className="category-overlay" style={{ position: 'relative', zIndex: 1 }}></div>
      </div>


      
      {description && (
        <div className="category-description-section">
          <p className={`category-desc-text ${isExpanded ? 'expanded' : ''}`}>
            {description}
          </p>
          <button className="read-more-btn" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? 'Read less' : 'Read more'}
          </button>
        </div>
      )}

      <div className="category-filter-bar">
        <div className="filter-left">
          <button className="filter-sort-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="21" x2="4" y2="14"></line>
              <line x1="4" y1="10" x2="4" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12" y2="3"></line>
              <line x1="20" y1="21" x2="20" y2="16"></line>
              <line x1="20" y1="12" x2="20" y2="3"></line>
              <line x1="1" y1="14" x2="7" y2="14"></line>
              <line x1="9" y1="8" x2="15" y2="8"></line>
              <line x1="17" y1="16" x2="23" y2="16"></line>
            </svg>
            Refine
          </button>
        </div>
        <div className="filter-right">
          <div className="featured-dropdown">
            Sort By: Recommended
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
          <span className="product-count">{count} ITEMS</span>
        </div>
      </div>
    </div>
  );
}
