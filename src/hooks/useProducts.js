import { useState, useEffect } from 'react';
import { getProducts } from '../services/productService';

export default function useProducts(params = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const body = await getProducts(params);

        if (isMounted) {
          const list = Array.isArray(body?.data) ? body.data : [];
          setProducts(list);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
          setProducts([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchProducts();
    return () => { isMounted = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);

  return { products, loading, error };
}
