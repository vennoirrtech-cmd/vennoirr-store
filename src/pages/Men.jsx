import { Helmet } from "react-helmet-async";
import ProductGrid from "../components/ProductGrid";
import CategoryHeader from "../components/CategoryHeader";
import menBannerImage from "../assets/images/Hero Image.png";

export default function Men() {
  return (
    <>
      <Helmet>
        <title>Men's Streetwear Collection | Vennoirr</title>
        <meta name="description" content="Shop Vennoirr's men's premium streetwear — Funky & Premium collections. Bold graphics, luxury fabrics. Free shipping on orders above ₹999." />
        <link rel="canonical" href="https://vennoirr.com/men" />
      </Helmet>
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
