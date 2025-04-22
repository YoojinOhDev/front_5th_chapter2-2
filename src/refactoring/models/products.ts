//계산
import { Discount, Product } from '../../types.ts';

export function updateProduct(products: Product[], newProduct: Product) {
  return products.map((product) =>
    product.id === newProduct.id ? newProduct : product,
  );
}

export function addProduct(products: Product[], newProduct: Product) {
  return [...products, newProduct];
}

export function hasDiscount(product: Product) {
  return product.discounts.length > 0;
}

export const addDiscountToProduct = (
  product: Product,
  newDiscount: Discount,
): Product => ({
  ...product,
  discounts: [...product.discounts, newDiscount],
});
