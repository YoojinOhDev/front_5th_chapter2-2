import { getMaxDiscountRate } from '../../../../../models/cart.ts';
import { AddToCart } from '../../../../../hooks';
import { Product } from '../../../../../../types.ts';
import {
  convertToLocaleString,
  getWholeNumberPercent,
} from '../../../../../utils.ts';
import { hasDiscount } from '../../../../../models/products.ts';

interface Props {
  product: Product;
  remainingStock: number;
  addToCart: AddToCart;
}

export const ProductCard = ({ product, remainingStock, addToCart }: Props) => {
  const hasStock = remainingStock > 0;
  return (
    <div
      key={product.id}
      data-testid={`product-${product.id}`}
      className='bg-white p-3 rounded shadow'
    >
      <div className='flex justify-between items-center mb-2'>
        <span className='font-semibold'>{product.name}</span>
        <span className='text-gray-600'>
          {convertToLocaleString(product.price)}원
        </span>
      </div>
      <div className='text-sm text-gray-500 mb-2'>
        <span
          className={`font-medium ${hasStock ? 'text-green-600' : 'text-red-600'}`}
        >
          재고: {remainingStock}개
        </span>
        {hasDiscount(product) && (
          <span className='ml-2 font-medium text-blue-600'>
            최대 {getWholeNumberPercent(getMaxDiscountRate(product.discounts))}%
            할인
          </span>
        )}
      </div>
      {hasDiscount(product) && (
        <ul className='list-disc list-inside text-sm text-gray-500 mb-2'>
          {product.discounts.map((discount, index) => (
            <li key={index}>
              {discount.quantity}개 이상: {getWholeNumberPercent(discount.rate)}
              % 할인
            </li>
          ))}
        </ul>
      )}
      <button
        onClick={() => addToCart(product)}
        className={`w-full px-3 py-1 rounded ${
          hasStock
            ? 'bg-blue-500 text-white hover:bg-blue-600'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
        disabled={!hasStock}
      >
        {hasStock ? '장바구니에 추가' : '품절'}
      </button>
    </div>
  );
};
