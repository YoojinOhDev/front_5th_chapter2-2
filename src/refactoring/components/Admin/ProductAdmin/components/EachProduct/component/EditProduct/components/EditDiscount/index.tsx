import { Dispatch, SetStateAction } from 'react';
import { Product } from '../../../../../../../../../../types.ts';
import { useHandleNewDiscount } from './hooks.ts';

interface Props {
  newProduct: Product;
  setNewProduct: Dispatch<SetStateAction<Product>>;
  onProductUpdate: (updatedProduct: Product) => void;
}

const removeDiscountFromProduct = (product: Product, index: number) => ({
  ...product,
  discounts: product.discounts.filter((_, i) => i !== index),
});

export const EditDiscount = ({
  newProduct,
  setNewProduct,
  onProductUpdate,
}: Props) => {
  function saveProduct(updatedProduct: Product) {
    onProductUpdate(updatedProduct);
    setNewProduct(updatedProduct);
  }

  const handleRemoveDiscount = (index: number) => {
    saveProduct(removeDiscountFromProduct(newProduct, index));
  };

  const { newDiscount, handleAddDiscount, handleNewDiscount } =
    useHandleNewDiscount(newProduct, saveProduct);

  return (
    <div>
      <h4 className='text-lg font-semibold mb-2'>할인 정보</h4>
      {newProduct.discounts.map((discount, index) => (
        <div key={index} className='flex justify-between items-center mb-2'>
          <span>
            {discount.quantity}개 이상 구매 시 {discount.rate * 100}% 할인
          </span>
          <button
            onClick={() => handleRemoveDiscount(index)}
            className='bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600'
          >
            삭제
          </button>
        </div>
      ))}

      <div className='flex space-x-2'>
        <input
          type='number'
          placeholder='수량'
          value={newDiscount.quantity}
          onChange={(e) =>
            handleNewDiscount('quantity', parseInt(e.target.value))
          }
          className='w-1/3 p-2 border rounded'
        />
        <input
          type='number'
          placeholder='할인율 (%)'
          value={newDiscount.rate * 100}
          onChange={(e) =>
            handleNewDiscount('rate', parseInt(e.target.value) / 100)
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
    </div>
  );
};
