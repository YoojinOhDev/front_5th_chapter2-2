//계산
import { Discount, Product } from '../../types.ts';

export const updateProduct = (products: Product[], newProduct: Product) =>
  products.map((product) =>
    product.id === newProduct.id ? newProduct : product,
  );

export const addProduct = (products: Product[], newProduct: Product) => [...products, newProduct];

export const hasDiscount = (product: Product) => product.discounts.length > 0;

export const addDiscountToProduct = (
  product: Product,
  newDiscount: Discount,
): Product => ({
  ...product,
  discounts: [...product.discounts, newDiscount],
});

export const removeDiscountFromProduct = (product: Product, index: number) => ({
  ...product,
  discounts: product.discounts.filter((_, i) => i !== index),
});
