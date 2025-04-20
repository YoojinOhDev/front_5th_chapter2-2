import { useState } from 'react';
import { Discount, Product } from '../../../../../../types.ts';

export function useHandleEditMode(onSave: () => void) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const handleEditMode = () => {
    if (isEditing) {
      // 저장 후 수정 모드 종료
      onSave();
      setIsEditing(false);
      return;
    }
    //수정 모드 시작
    setIsEditing(true);
  };
  return {
    isEditing,
    handleEditMode,
  };
}

export function useHandleNewProduct(
  product: Product,
  onProductUpdate: (updatedProduct: Product) => void,
) {
  const [newProduct, setNewProduct] = useState<Product>(product);
  const [newDiscount, setNewDiscount] = useState<Discount>({
    quantity: 0,
    rate: 0,
  });

  function handleUpdate(
    key: 'name' | 'price',
    newValue: any, //todo: 수정
  ) {
    if (key === 'name' || key === 'price') {
      setNewProduct((prev) => ({
        ...prev,
        [key]: newValue,
      }));
      return;
    }
  }
  const handleStockUpdate = (newValue: number) => {
    const updatedProduct = { ...newProduct, stock: newValue };
    onProductUpdate(updatedProduct);
    setNewProduct(updatedProduct);
  };

  const handleAddDiscount = () => {
    const updatedProduct = {
      ...newProduct,
      discounts: [...newProduct.discounts, newDiscount],
    };
    onProductUpdate(updatedProduct);
    setNewProduct(updatedProduct);
    setNewDiscount({ quantity: 0, rate: 0 });
  };

  const handleRemoveDiscount = (index: number) => {
    const updatedProduct = {
      ...newProduct,
      discounts: newProduct.discounts.filter((_, i) => i !== index),
    };
    onProductUpdate(updatedProduct);
    setNewProduct(updatedProduct);
  };

  return {
    newProduct,
    newDiscount,
    handleUpdate,
    handleStockUpdate,
    handleRemoveDiscount,
    setNewDiscount,
    handleAddDiscount,
  };
}
