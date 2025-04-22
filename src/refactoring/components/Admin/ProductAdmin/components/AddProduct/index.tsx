import { useState } from 'react';
import { Product } from '../../../../../../types.ts';
import { useGetProductAddHandler } from './hooks.ts';
import { formInputFields } from '../../data.ts';

interface Props {
  onProductAdd: (newProduct: Product) => void;
}

export const AddProduct = ({ onProductAdd }: Props) => {
  const [showNewProductForm, setShowNewProductForm] = useState(false);

  const { newProduct, setNewProduct, handleAddNewProduct } =
    useGetProductAddHandler(onProductAdd, setShowNewProductForm);

  return (
    <div id={'상품 추가 섹션'}>
      <button
        onClick={() => setShowNewProductForm(!showNewProductForm)}
        className='bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600'
      >
        {showNewProductForm ? '취소' : '새 상품 추가'}
      </button>

      {showNewProductForm && (
        <div className='bg-white p-4 rounded shadow mb-4'>
          <h3 className='text-xl font-semibold mb-2'>새 상품 추가</h3>

          {formInputFields.map(({ type, formatter, id, label, key }) => (
            <div className='mb-2'>
              <label
                htmlFor={id}
                className='block text-sm font-medium text-gray-700'
              >
                {label}
              </label>
              <input
                id={id}
                type={type}
                value={newProduct[key]}
                onChange={(e) =>
                  setNewProduct((prev) => ({ ...prev, [key]: formatter(e) }))
                }
                className='w-full p-2 border rounded'
              />
            </div>
          ))}

          <button
            onClick={handleAddNewProduct}
            className='w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600'
          >
            추가
          </button>
        </div>
      )}
    </div>
  );
}
