import { Helmet } from "react-helmet-async";
import ProductGrid from "../components/ProductGrid";
import CategoryHeader from "../components/CategoryHeader";
import menBannerImage from "../assets/images/Hero Image.png";

export default function MenFunky() {
  return (
    <>
      <Helmet>
        <title>Men's Funky Streetwear | Vennoirr</title>
        <meta name="description" content="Explore Vennoirr's Men's Funky collection. Bold graphics and expressive streetwear. Free shipping above ₹999." />
        <link rel="canonical" href="https://vennoirr.com/men/funky" />
      </Helmet>
      <CategoryHeader 
        title="MEN — FUNKY"
        breadcrumbList={[
          { label: "Home", path: "/" },
          { label: "Men", path: "/men" },
          { label: "Funky", path: "/men/funky" }
        ]}
        image={menBannerImage}
        description="Luxury streetwear essentials with high-end fabrics."
        count={18}
      />
      <ProductGrid category="men" subcategory="premium" />
    </>
  );
}