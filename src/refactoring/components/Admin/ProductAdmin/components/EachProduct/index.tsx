import { useState } from 'react';
import { Product } from '../../../../../../types.ts';
import { EditProduct } from './component/EditProduct';
import { useHandleEdit } from './hooks.ts';
import { DisplayProduct } from './component/DisplayProduct';

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
              <DisplayProduct product={product} startEditing={startEditing} />
            )}
          </div>
        )}
      </div>
    </>
  );
};
