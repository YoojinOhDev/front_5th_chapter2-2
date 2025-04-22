import { useState } from 'react';
import { Product } from '../../types.ts';
import { addProduct, updateProduct } from '../models/products.ts';

export const useProducts = (initialProducts: Product[]) => {
  const [products, setProducts] = useState(initialProducts);

  return {
    products: products,
    updateProduct: (newProduct: Product) =>
      setProducts((prev) => updateProduct(prev, newProduct)),
    addProduct: (newProduct: Product) =>
      setProducts((prev) => addProduct(prev, newProduct)),
  };
};
