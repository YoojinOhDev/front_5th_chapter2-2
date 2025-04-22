import { useState } from 'react';
import { Discount } from '../../../../../../../../../../../../types.ts';
import { defaultDiscount } from '../../data.ts';

export const useDiscountForm = () => {
  const [newDiscount, setNewDiscount] = useState<Discount>(defaultDiscount);

  const updateDiscountField = (key: 'quantity' | 'rate', newValue: number) => {
    setNewDiscount((prev) => ({
      ...prev,
      [key]: newValue,
    }));
  };

  const resetDiscountForm = () => {
    setNewDiscount(defaultDiscount);
  };

  return {
    newDiscount,
    updateDiscountField,
    resetDiscountForm,
  };
};
