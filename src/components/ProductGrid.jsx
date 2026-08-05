import useProducts from "../hooks/useProducts";
import ProductCard from "./ProductCard";

export default function ProductGrid({ category, subcategory }) {
  // Map frontend's generic 'category' prop to the backend's 'gender' field requirement
  const genderParam = category === 'men' ? 'Men' : category === 'women' ? 'Women' : undefined;

  const { products } = useProducts(genderParam ? { gender: genderParam } : {});
  let filtered = products;

  if (category) {
    filtered = filtered.filter(
      (p) => 
        p.gender?.toLowerCase() === category.toLowerCase() || 
        p.gender?.toLowerCase() === 'unisex'
    );
  }

  if (subcategory) {
    filtered = filtered.filter(
      (p) => {
        const catName = p.category?.name?.toLowerCase() || '';
        const hasTag = p.tags?.some(t => t.toLowerCase().includes(subcategory.toLowerCase()));
        return catName.includes(subcategory.toLowerCase()) || hasTag;
      }
    );
  }

  return (
    <div className="product-grid" style={{ padding: "40px var(--container-padding)" }}>
      {filtered.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
