import { Dispatch, SetStateAction } from 'react';
import { Product } from '../../../../../../../../../../types.ts';
import { useDiscountForm } from './components/AddDiscount/hooks.ts';
import { getPercent } from '../../../../../../../../../utils.ts';
import {
  addDiscountToProduct,
  removeDiscountFromProduct,
} from '../../../../../../../../../models/products.ts';

interface Props {
  newProduct: Product;
  setNewProduct: Dispatch<SetStateAction<Product>>;
  onProductUpdate: (updatedProduct: Product) => void;
}

const AddNewDiscount = ({ newProduct, setNewProduct, onProductUpdate }: Props) => {
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
};

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
