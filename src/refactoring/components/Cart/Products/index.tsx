import { Product } from '../../../../types.ts';
import { AddToCart, GetRemainingStock } from '../../../hooks';
import { ProductCard } from './components/ProductCard';

interface Props {
  products: Product[];
  addToCart: AddToCart;
  getRemainingStock: GetRemainingStock;
}

export const Products = ({ products, addToCart, getRemainingStock }: Props) => {
  return (
    <div id={'상품목록'}>
      <h2 className='text-2xl font-semibold mb-4'>상품 목록</h2>
      <div className='space-y-2'>
        {products.map((product) => {
          return (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={addToCart}
              remainingStock={getRemainingStock(product)}
            />
          );
        })}
      </div>
    </div>
  );
};
