import { Helmet } from "react-helmet-async";
import ProductGrid from "../components/ProductGrid";
import CategoryHeader from "../components/CategoryHeader";
import womenBannerImage from "../assets/images/Untitled-2 (1)_page-0001.jpg";

export default function WomenFunky() {
  return (
    <>
      <Helmet>
        <title>Women's Funky Streetwear | Vennoirr</title>
        <meta name="description" content="Shop Vennoirr Women's Funky collection. Bold, expressive streetwear for the fearless. Free shipping above ₹999." />
        <link rel="canonical" href="https://vennoirr.com/women/funky" />
      </Helmet>
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