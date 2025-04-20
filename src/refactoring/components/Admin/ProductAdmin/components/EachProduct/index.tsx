import { useState } from 'react';
import { Product } from '../../../../../../types.ts';
import { useHandleEditMode, useHandleNewProduct } from './hooks.ts';

interface Props {
  onProductUpdate: (updatedProduct: Product) => void;
  product: Product;
  index: number;
}

export const EachProduct = ({ onProductUpdate, product, index }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    newProduct,
    newDiscount,
    handleUpdate,
    handleStockUpdate,
    handleRemoveDiscount,
    setNewDiscount,
    handleAddDiscount,
  } = useHandleNewProduct(product, onProductUpdate);
  function onSave() {
    onProductUpdate(newProduct);
  }
  const { isEditing, handleEditMode } = useHandleEditMode(onSave);
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
              <div>
                <div className='mb-4'>
                  <label className='block mb-1'>상품명: </label>
                  <input
                    type='text'
                    value={newProduct.name}
                    onChange={(e) => handleUpdate('name', e.target.value)}
                    className='w-full p-2 border rounded'
                  />
                </div>
                <div className='mb-4'>
                  <label className='block mb-1'>가격: </label>
                  <input
                    type='number'
                    value={newProduct.price}
                    onChange={(e) =>
                      handleUpdate('price', parseInt(e.target.value))
                    }
                    className='w-full p-2 border rounded'
                  />
                </div>
                <div className='mb-4'>
                  <label className='block mb-1'>재고: </label>
                  <input
                    type='number'
                    value={newProduct.stock}
                    onChange={(e) =>
                      handleStockUpdate(parseInt(e.target.value))
                    }
                    className='w-full p-2 border rounded'
                  />
                </div>
                {/* 할인 정보 수정 부분 */}
                <div>
                  <h4 className='text-lg font-semibold mb-2'>할인 정보</h4>
                  {newProduct.discounts.map((discount, index) => (
                    <div
                      key={index}
                      className='flex justify-between items-center mb-2'
                    >
                      <span>
                        {discount.quantity}개 이상 구매 시 {discount.rate * 100}
                        % 할인
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
                        setNewDiscount({
                          ...newDiscount,
                          quantity: parseInt(e.target.value),
                        })
                      }
                      className='w-1/3 p-2 border rounded'
                    />
                    <input
                      type='number'
                      placeholder='할인율 (%)'
                      value={newDiscount.rate * 100}
                      onChange={(e) =>
                        setNewDiscount({
                          ...newDiscount,
                          rate: parseInt(e.target.value) / 100,
                        })
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
                <button
                  onClick={handleEditMode}
                  className='bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mt-2'
                >
                  수정 완료
                </button>
              </div>
            ) : (
              <div>
                {product.discounts.map((discount, index) => (
                  <div key={index} className='mb-2'>
                    <span>
                      {discount.quantity}개 이상 구매 시 {discount.rate * 100}%
                      할인
                    </span>
                  </div>
                ))}
                <button
                  data-testid='modify-button'
                  onClick={handleEditMode}
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
