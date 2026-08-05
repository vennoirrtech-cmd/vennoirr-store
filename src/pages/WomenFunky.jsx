import ProductGrid from "../components/ProductGrid";
import CategoryHeader from "../components/CategoryHeader";
import womenBannerImage from "../assets/images/Untitled-2 (1)_page-0001.jpg";

export default function WomenFunky() {
  return (
    <>
      <CategoryHeader 
        title="WOMEN — FUNKY"
        breadcrumbList={[
          { label: "Home", path: "/" },
          { label: "Women", path: "/women" },
          { label: "Funky", path: "/women/funky" }
        ]}
        image={womenBannerImage}
        description="Bold and expressive streetwear for the fearless."
        count={28}
      />
      <ProductGrid category="women" subcategory="funky" />
    </>
  );
}