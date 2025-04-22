import { Dispatch, SetStateAction } from 'react';
import { Product } from '../../../../../../../../../../../../types.ts';
import { useDiscountForm } from './hooks.ts';
import { addDiscountToProduct } from '../../../../../../../../../../../models/products.ts';

interface Props {
  newProduct: Product;
  setNewProduct: Dispatch<SetStateAction<Product>>;
  onProductUpdate: (updatedProduct: Product) => void;
}
export function AddNewDiscount({
  newProduct,
  setNewProduct,
  onProductUpdate,
}: Props) {
  const { newDiscount, updateDiscountField, resetDiscountForm } =
    useDiscountForm();

  function handleAddDiscount() {
    const updatedProduct = addDiscountToProduct(newProduct, newDiscount);
    setNewProduct(updatedProduct);
    onProductUpdate(updatedProduct);
    resetDiscountForm();
  }

  return (
    <div className='flex space-x-2'>
      <input
        type='number'
        placeholder='수량'
        value={newDiscount.quantity}
        onChange={(e) =>
          updateDiscountField('quantity', parseInt(e.target.value))
        }
        className='w-1/3 p-2 border rounded'
      />
      <input
        type='number'
        placeholder='할인율 (%)'
        value={newDiscount.rate * 100}
        onChange={(e) =>
          updateDiscountField('rate', parseInt(e.target.value) / 100)
        }
        className='w-1/3 p-2 border rounded'
      />
      <button
        onClick={handleAddDiscount}
        className='w-1/3 bg-blue-500 text-white p-2 rounded hover:bg-blue-600'
      >
        할인 추가
      </button>
    </div>
  );
}
