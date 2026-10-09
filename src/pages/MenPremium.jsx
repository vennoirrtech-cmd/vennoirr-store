import { Helmet } from "react-helmet-async";
import ProductGrid from "../components/ProductGrid";
import CategoryHeader from "../components/CategoryHeader";
import menBannerImage from "../assets/images/Hero 3.png";

export default function MenPremium() {
  return (
    <>
      <Helmet>
        <title>Men's Premium Streetwear | Vennoirr</title>
        <meta name="description" content="Shop Vennoirr's Men's Premium collection. Luxury fabrics, refined streetwear. Free shipping above ₹999." />
        <link rel="canonical" href="https://vennoirr.com/men/premium" />
      </Helmet>
      <CategoryHeader 
        title="MEN — PREMIUM"
        breadcrumbList={[
          { label: "Home", path: "/" },
          { label: "Men", path: "/men" },
          { label: "Premium", path: "/men/premium" }
        ]}
        image={menBannerImage}
        description="Luxury streetwear essentials with high-end fabrics."
        count={18}
      />
      <ProductGrid category="men" subcategory="premium" />
    </>
  );
}