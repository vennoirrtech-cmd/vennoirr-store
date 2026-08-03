import { useState, useEffect } from 'react';
import { getProducts } from '../services/productService';
import localProducts from '../data/products';

export default function useProducts(params = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // getProducts returns response.data from axios, i.e. the JSON body:
        // { success: true, data: [...products], pagination: {...} }
        const body = await getProducts(params);

        if (isMounted) {
          const list = Array.isArray(body?.data) ? body.data : [];

          if (body?.success && list.length > 0) {
            setProducts(list);
          } else {
            // Backend returned no products — fall back to local mock data
            setProducts(getLocalFallback(params));
          }
        }
      } catch (err) {
        if (isMounted) setError(err);
        // Backend unavailable — use local fallback
        if (isMounted) {
          setProducts(getLocalFallback(params));
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

/** Local mock data filtered by the same params passed to the API */
function getLocalFallback(params) {
  let filtered = [...localProducts];
  if (params.isBestSeller) filtered = filtered.filter(p => p.isBestSeller);
  if (params.isNewArrival) filtered = filtered.filter(p => p.isNewArrival ?? p.isNew);
  if (params.isTrending)   filtered = filtered.filter(p => p.isTrending);
  if (params.gender)       filtered = filtered.filter(p => p.gender === params.gender);
  return filtered;
}
