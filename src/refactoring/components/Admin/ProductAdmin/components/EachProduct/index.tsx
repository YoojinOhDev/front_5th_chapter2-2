import { useState } from 'react';
import { Product } from '../../../../../../types.ts';
import { EditProduct } from './component/EditProduct';
import { useHandleEdit } from './hooks.ts';
import { getPercent } from '../../../../../utils.ts';

interface Props {
  onProductUpdate: (updatedProduct: Product) => void;
  product: Product;
  index: number;
}

export const EachProduct = ({ onProductUpdate, product, index }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isEditing, startEditing, saveEditing } =
    useHandleEdit(onProductUpdate);

  return (
    <>
      <div
        key={product.id}
        data-testid={`product-${index + 1}`}
        className='bg-white p-4 rounded shadow'
      >
        <button
          data-testid='toggle-button'
          onClick={() => setIsOpen((prev) => !prev)}
          className='w-full text-left font-semibold'
        >
          {product.name} - {product.price}원 (재고: {product.stock})
        </button>
        {isOpen && (
          <div className='mt-2'>
            {isEditing ? (
              <EditProduct
                onProductUpdate={onProductUpdate}
                product={product}
                saveEditing={saveEditing}
              />
            ) : (
              <div>
                {product.discounts.map((discount, index) => (
                  <div key={index} className='mb-2'>
                    <span>
                      {discount.quantity}개 이상 구매 시{' '}
                      {getPercent(discount.rate)}% 할인
                    </span>
                  </div>
                ))}
                <button
                  data-testid='modify-button'
                  onClick={startEditing}
                  className='bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mt-2'
                >
                  수정
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};
