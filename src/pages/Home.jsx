import { useState } from "react";
import { Helmet } from "react-helmet-async";
import HeroBanner from "../components/HeroBanner";
import ProductCarousel from "../components/ProductCarousel";
import ProductGrid from "../components/ProductGrid";
import CollectionBanner from "../components/CollectionBanner";
import ProductSidebar from "../components/ProductSidebar";
import useHomepageSections from "../hooks/useHomepageSections";
import useProducts from "../hooks/useProducts";
import SkeletonCard from "../components/SkeletonCard";

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { sections, loading, error } = useHomepageSections();
  
  // Need hooks for fallback if dynamic layout fails
  const { products: newProducts, loading: newLoading } = useProducts({ isNewArrival: true });
  const { products: bestProducts, loading: bestLoading } = useProducts({ isBestSeller: true });

  // Structured Data Schema for Organization and Website
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Vennoirr",
    "url": "https://vennoirr.com/",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://vennoirr.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Vennoirr",
    "url": "https://vennoirr.com",
    "logo": "https://vennoirr.com/vennoirr.png",
    "sameAs": [
      "https://www.instagram.com/vennoirrr",
      "https://www.facebook.com/vennoirr"
    ]
  };

  const renderSkeleton = () => (
    <section className="product-carousel container">
      <div className="section-header-wrapper">
        <div className="section-header-main">
          <h2>Loading Collection</h2>
        </div>
      </div>
      <div className="skeleton-grid">
        {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
      </div>
    </section>
  );

  const renderSections = () => {
    if (loading) return renderSkeleton();

    // Fallback safety
    if (error || !sections || sections.length === 0) {
      if (newLoading || bestLoading) return renderSkeleton();
      return (
        <>
          <ProductCarousel section={{
            title: "New In", 
            subtitle: "Architectural proportions. Heavyweight custom jersey.",
            ctaLabel: "Shop New Arrivals",
            slug: "new-in",
            products: newProducts
          }} />
          <ProductCarousel section={{
            title: "Best Sellers", 
            subtitle: "Handpicked and crafted for you",
            ctaLabel: "Shop Best Sellers",
            slug: "best-sellers",
            products: bestProducts
          }} />
        </>
      );
    }

    // Dynamic rendering map
    return sections.map((section) => {
      switch (section.layoutStyle) {
        case 'horizontal_scroll':
          return <ProductCarousel key={section._id} section={section} />;
        case 'grid_4col':
          return <ProductGrid key={section._id} sectionData={section} />;
        case 'editorial_split':
          return <CollectionBanner key={section._id} sectionData={section} />;
        default:
          return <ProductCarousel key={section._id} section={section} />;
      }
    });
  };

  return (
    <div>
      <Helmet>
        <title>Vennoirr | Premium Streetwear Fashion</title>
        <meta name="description" content="Shop India's boldest premium streetwear. New drops, men's & women's collections. Free shipping above ₹999." />
        <link rel="canonical" href="https://vennoirr.com/" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>
      </Helmet>
      
      <HeroBanner />
      
      {renderSections()}

      <ProductSidebar
        product={selectedProduct}
        close={() => setSelectedProduct(null)}
      />
    </div>
  );
}
