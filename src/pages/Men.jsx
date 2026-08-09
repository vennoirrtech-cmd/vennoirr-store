import ProductGrid from "../components/ProductGrid";
import CategoryHeader from "../components/CategoryHeader";
import menBannerImage from "../assets/images/Hero Image.png";

export default function Men() {
  return (
    <>
      <CategoryHeader 
        title="MEN'S COLLECTION"
        breadcrumbList={[
          { label: "Home", path: "/" },
          { label: "Shop", path: "/men" },
          { label: "Men", path: "/men" }
        ]}
        image={menBannerImage}
        description="Stay cool and confident with Vennoirr's menswear collection - your go-to for easy layering and everyday streetwear comfort. Elevate your wardrobe with premium fabrics and modern drops."
        count={89}
      />
      <ProductGrid category="men" />
    </>
  );
}
