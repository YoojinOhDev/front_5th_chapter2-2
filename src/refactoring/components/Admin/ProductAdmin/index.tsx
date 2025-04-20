import { Product } from '../../../../types.ts';
import { AddProduct } from './components/AddProduct';
import { EachProduct } from './components/EachProduct';

interface Props {
  products: Product[];
  onProductUpdate: (updatedProduct: Product) => void;
  onProductAdd: (newProduct: Product) => void;
}

export const ProductAdmin = ({
  products,
  onProductUpdate,
  onProductAdd,
}: Props) => {
  return (
    <div id={'상품관리'}>
      <h2 className='text-2xl font-semibold mb-4'>상품 관리</h2>
      <AddProduct onProductAdd={onProductAdd} />

      <div className='space-y-2'>
        {products.map((product: Product, index: number) => (
          <EachProduct
            onProductUpdate={onProductUpdate}
            product={product}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};
