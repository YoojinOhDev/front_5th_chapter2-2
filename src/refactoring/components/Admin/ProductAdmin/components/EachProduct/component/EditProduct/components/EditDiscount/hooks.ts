import { useState } from 'react';
import { Discount, Product } from '../../../../../../../../../../types.ts';
import { defaultDiscount } from './data.ts';

const addDiscountToProduct = (
  product: Product,
  newDiscount: Discount,
): Product => ({
  ...product,
  discounts: [...product.discounts, newDiscount],
});

export function useHandleNewDiscount(
  newProduct: Product,
  saveProduct: (updatedProduct: Product) => void,
) {
  const [newDiscount, setNewDiscount] = useState<Discount>(defaultDiscount);

  //할인 수량, 할인율 입력후 반영 (실제로 newProduct, 실제 product 에 반영 후 discount 폼 초기화)
  const handleAddDiscount = () => {
    saveProduct(addDiscountToProduct(newProduct, newDiscount));
    setNewDiscount(defaultDiscount);
  };
  function handleNewDiscount(key: 'quantity' | 'rate', newValue: number) {
    setNewDiscount((prev) => ({
      ...prev,
      [key]: newValue,
    }));
  }
  return {
    newDiscount,
    handleAddDiscount,
    handleNewDiscount,
  };
}
