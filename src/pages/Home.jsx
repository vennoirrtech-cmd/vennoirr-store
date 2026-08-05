import { useState } from "react";
import { Helmet } from "react-helmet-async";
import HeroBanner from "../components/HeroBanner";
import NewArrivals from "../components/NewArrivals";
import BestSellers from "../components/BestSellers";
import VideoSection from "../components/VideoSection";
import ProductSidebar from "../components/ProductSidebar";

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState(null);

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

  return (
    <div>
      <Helmet>
        <title>Vennoirr | Premium Streetwear Fashion</title>
        <meta name="description" content="Shop the finest premium streetwear fashion at Vennoirr. Explore bold and funky styles, out-of-the-norm luxury fabrics, and expressive collections." />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      
      <HeroBanner />
      <NewArrivals />
      <BestSellers />
      <VideoSection />

      <ProductSidebar
        product={selectedProduct}
        close={() => setSelectedProduct(null)}
      />
    </div>
  );
}
