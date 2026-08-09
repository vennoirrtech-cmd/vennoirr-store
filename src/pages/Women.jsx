import { Helmet } from "react-helmet-async";
import ProductGrid from "../components/ProductGrid";
import CategoryHeader from "../components/CategoryHeader";
import womenBannerImage from "../assets/images/Untitled-2 (1)_page-0001.jpg";

export default function Women() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Women's Premium Streetwear Collection - Vennoirr",
    "description": "Discover the latest women's streetwear collection. Premium fabrics, bold designs.",
    "url": "https://vennoirr.com/women"
  };

  return (
    <>
      <Helmet>
        <title>Women's Collection | Vennoirr</title>
        <meta name="description" content="Stay cool and confident with Vennoirr's women's collection - your go-to for easy layering and everyday streetwear comfort." />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <CategoryHeader 
        title="WOMEN'S COLLECTION"
        breadcrumbList={[
          { label: "Home", path: "/" },
          { label: "Shop", path: "/women" },
          { label: "Women", path: "/women" }
        ]}
        image={womenBannerImage}
        description="Stay cool and confident with Vennoirr's womenswear collection - your go-to for easy layering and everyday streetwear comfort."
        count={54}
      />
      <ProductGrid category="women" />
    </>
  );
}
