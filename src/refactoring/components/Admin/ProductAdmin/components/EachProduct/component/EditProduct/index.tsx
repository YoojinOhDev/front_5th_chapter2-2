import { useHandleNewProduct } from './hooks.ts';
import { Product } from '../../../../../../../../types.ts';
import { EditDiscount } from './components/EditDiscount';
import { formInputFields } from '../../../AddProduct/data.ts';

interface Props {
  onProductUpdate: (updatedProduct: Product) => void;
  product: Product;
  saveEditing: (newProduct: Product) => void;
}

export const EditProduct = ({
  onProductUpdate,
  product,
  saveEditing,
}: Props) => {
  const { newProduct, handleUpdate, setNewProduct } = useHandleNewProduct(
    product,
    onProductUpdate,
  );

  function handleClickEditDone() {
    saveEditing(newProduct);
  }
  return (
    <div>
      {/* 상품 기본 정보 (이름, 가격, 재고)  수정 부분*/}
      {formInputFields.map(({ type, formatter, label, key }) => (
        <div className='mb-4'>
          <label className='block mb-1'>{label}: </label>
          <input
            type={type}
            value={newProduct[key]}
            onChange={(e) => handleUpdate(key, formatter(e))}
            className='w-full p-2 border rounded'
          />
        </div>
      ))}

      {/* 할인 정보 수정 부분 */}
      <EditDiscount
        newProduct={newProduct}
        setNewProduct={setNewProduct}
        onProductUpdate={onProductUpdate}
      />

      <button
        onClick={handleClickEditDone}
        className='bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mt-2'
      >
        수정 완료
      </button>
    </div>
  );
};
