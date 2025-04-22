import { CartPage } from './components/CartPage.tsx';
import { AdminPage } from './components/AdminPage.tsx';
import { useCoupons, useProducts } from './hooks';
import { initialCoupons } from './data/initialCoupons.ts';
import { initialProducts } from './data/initialProducts.ts';
import { Nav } from './components/Nav';
import { useTogglePage } from './components/Nav/hooks.ts';

const App = () => {
  const { products, updateProduct, addProduct } = useProducts(initialProducts);
  const { coupons, addCoupon } = useCoupons(initialCoupons);
  const { isAdmin, switchPage } = useTogglePage();

  return (
    <div className='min-h-screen bg-gray-100'>
      <Nav isAdmin={isAdmin} switchPage={switchPage} />
      <main className='container mx-auto mt-6'>
        {isAdmin ? (
          <AdminPage
            products={products}
            coupons={coupons}
            onProductUpdate={updateProduct}
            onProductAdd={addProduct}
            onCouponAdd={addCoupon}
          />
        ) : (
          <CartPage products={products} coupons={coupons} />
        )}
      </main>
    </div>
  );
};

export default App;
