import { useState } from 'react';
import { Product } from '../../../../../../types.ts';

export const useHandleEdit = (
  onProductUpdate: (updatedProduct: Product) => void,
) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  function startEditing() {
    if (isEditing) {
      return;
    }

    setIsEditing(true);
  }

  const saveEditing = (newProduct: Product) => {
    if (isEditing) {
      // 저장 후 수정 모드 종료
      onProductUpdate(newProduct);
      setIsEditing(false);
      return;
    }
  };

  return {
    isEditing,
    startEditing,
    saveEditing,
  };
};
