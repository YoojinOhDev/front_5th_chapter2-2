import { useState } from 'react';
import { Product } from '../../../../../../../../types.ts';

const getNewProduct = (product: Product, key: string, value: any): Product => {
  const validKeys = ['name', 'price', 'stock'];

  if (!validKeys.includes(key)) {
    return product;
  }

  return {
    ...product,
    [key]: value,
  };
};

export const useHandleNewProduct = (
  product: Product,
  onProductUpdate: (updatedProduct: Product) => void,
) => {
  const [newProduct, setNewProduct] = useState<Product>(product);

  function handleUpdate(
    key: 'name' | 'price' | 'stock',
    newValue: any, //todo: 수정
    immediatelySave: boolean = false,
  ) {
    const updatedProduct: Product = getNewProduct(newProduct, key, newValue);
    setNewProduct(updatedProduct);
    if (immediatelySave) {
      onProductUpdate(updatedProduct);
    }
    // setNewProduct((prev) => getNewProduct(prev, key, newValue));// 이렇게 쓸 방법이 없을까
  }

  return {
    newProduct,
    handleUpdate,
    setNewProduct,
  };
};
