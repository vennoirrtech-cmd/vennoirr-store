import ProductGrid from "../components/ProductGrid";
import CategoryHeader from "../components/CategoryHeader";
import womenBannerImage from "../assets/images/Untitled-2 (1)_page-0001.jpg";

export default function WomenPremium() {
  return (
    <>
      <CategoryHeader 
        title="WOMEN — PREMIUM"
        breadcrumbList={[
          { label: "Home", path: "/" },
          { label: "Women", path: "/women" },
          { label: "Premium", path: "/women/premium" }
        ]}
        image={womenBannerImage}
        description="Sophisticated streetwear tailored from luxury fabrics."
        count={28}
      />
      <ProductGrid category="women" subcategory="premium" />
    </>
  );
}