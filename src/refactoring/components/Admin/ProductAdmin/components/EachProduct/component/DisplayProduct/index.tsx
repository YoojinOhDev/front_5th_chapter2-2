import { Product } from '../../../../../../../../types.ts';
import { getPercent } from '../../../../../../../utils.ts';

interface Props {
  product: Product;
  startEditing: () => void;
}

export const DisplayProduct = ({ product, startEditing }: Props) => {
  return (
    <div>
      {product.discounts.map((discount, index) => (
        <div key={index} className='mb-2'>
          <span>
            {discount.quantity}개 이상 구매 시 {getPercent(discount.rate)}% 할인
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
  );
};
