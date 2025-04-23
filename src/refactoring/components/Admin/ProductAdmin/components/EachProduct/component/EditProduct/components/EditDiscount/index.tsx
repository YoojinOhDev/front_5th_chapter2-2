import { Dispatch, SetStateAction } from 'react';
import { Product } from '../../../../../../../../../../types.ts';
import { getPercent } from '../../../../../../../../../utils.ts';
import { removeDiscountFromProduct } from '../../../../../../../../../models/products.ts';
import { AddNewDiscount } from './components/AddDiscount';

interface Props {
  newProduct: Product;
  setNewProduct: Dispatch<SetStateAction<Product>>;
  onProductUpdate: (updatedProduct: Product) => void;
}

export const EditDiscount = ({
  newProduct,
  setNewProduct,
  onProductUpdate,
}: Props) => {
  const handleRemoveDiscount = (index: number) => {
    const updatedProduct = removeDiscountFromProduct(newProduct, index);
    onProductUpdate(updatedProduct);
    setNewProduct(updatedProduct);
  };

  return (
    <div>
      <h4 className='text-lg font-semibold mb-2'>할인 정보</h4>
      {newProduct.discounts.map((discount, index) => (
        <div key={index} className='flex justify-between items-center mb-2'>
          <span>
            {discount.quantity}개 이상 구매 시 {getPercent(discount.rate)}% 할인
          </span>
          <button
            onClick={() => handleRemoveDiscount(index)}
            className='bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600'
          >
            삭제
          </button>
        </div>
      ))}

      <AddNewDiscount
        newProduct={newProduct}
        setNewProduct={setNewProduct}
        onProductUpdate={onProductUpdate}
      />
    </div>
  );
};
