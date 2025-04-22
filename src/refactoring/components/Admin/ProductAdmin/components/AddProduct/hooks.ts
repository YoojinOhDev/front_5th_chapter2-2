import { Product } from '../../../../../../types.ts';
import { Dispatch, SetStateAction, useState } from 'react';
import { defaultProduct } from '../../data.ts';

export function useGetProductAddHandler(
  onProductAdd: (newProduct: Product) => void,
  setShowNewProductForm: Dispatch<SetStateAction<boolean>>,
) {
  const [newProduct, setNewProduct] =
    useState<Omit<Product, 'id'>>(defaultProduct);

  const handleAddNewProduct = () => {
    const productWithId: Product = { ...newProduct, id: Date.now().toString() };
    onProductAdd(productWithId);

    // 폼 초기화
    setNewProduct(defaultProduct);
    setShowNewProductForm(false);
  };
  return { newProduct, setNewProduct, handleAddNewProduct };
}
