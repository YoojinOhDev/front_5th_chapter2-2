import { useState } from 'react';
import { describe, expect, test } from 'vitest';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { CartPage } from '../../refactoring/components/CartPage';
import { AdminPage } from '../../refactoring/components/AdminPage';
import { Coupon, Product, Cart, Discount } from '../../types';
import {
  convertToLocaleString,
  getPercent,
  getWholeNumberPercent,
} from '../../refactoring/utils';
import {
  findCartItemById,
  makeCartItem,
  addNewItemToCart,
  removeItemFromCart,
} from '../../refactoring/models/cart';
import { discountAmount } from '../../refactoring/models/coupons';
import {
  updateProduct,
  addProduct,
  hasDiscount,
  addDiscountToProduct,
  removeDiscountFromProduct,
} from '../../refactoring/models/products';
import { useTogglePage } from '../../refactoring/components/Nav/hooks';
import { useDiscountForm } from '../../refactoring/components/Admin/ProductAdmin/components/EachProduct/component/EditProduct/components/EditDiscount/components/AddDiscount/hooks';

const mockProducts: Product[] = [
  {
    id: 'p1',
    name: '상품1',
    price: 10000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.1 }],
  },
  {
    id: 'p2',
    name: '상품2',
    price: 20000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.15 }],
  },
  {
    id: 'p3',
    name: '상품3',
    price: 30000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.2 }],
  },
];
const mockCoupons: Coupon[] = [
  {
    name: '5000원 할인 쿠폰',
    code: 'AMOUNT5000',
    discountType: 'amount',
    discountValue: 5000,
  },
  {
    name: '10% 할인 쿠폰',
    code: 'PERCENT10',
    discountType: 'percentage',
    discountValue: 10,
  },
];

const TestAdminPage = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);

  const handleProductUpdate = (updatedProduct: Product) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) =>
        p.id === updatedProduct.id ? updatedProduct : p,
      ),
    );
  };

  const handleProductAdd = (newProduct: Product) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  const handleCouponAdd = (newCoupon: Coupon) => {
    setCoupons((prevCoupons) => [...prevCoupons, newCoupon]);
  };

  return (
    <AdminPage
      products={products}
      coupons={coupons}
      onProductUpdate={handleProductUpdate}
      onProductAdd={handleProductAdd}
      onCouponAdd={handleCouponAdd}
    />
  );
};

describe('advanced > ', () => {
  describe('시나리오 테스트 > ', () => {
    test('장바구니 페이지 테스트 > ', async () => {
      render(<CartPage products={mockProducts} coupons={mockCoupons} />);
      const product1 = screen.getByTestId('product-p1');
      const product2 = screen.getByTestId('product-p2');
      const product3 = screen.getByTestId('product-p3');
      const addToCartButtonsAtProduct1 =
        within(product1).getByText('장바구니에 추가');
      const addToCartButtonsAtProduct2 =
        within(product2).getByText('장바구니에 추가');
      const addToCartButtonsAtProduct3 =
        within(product3).getByText('장바구니에 추가');

      // 1. 상품 정보 표시
      expect(product1).toHaveTextContent('상품1');
      expect(product1).toHaveTextContent('10,000원');
      expect(product1).toHaveTextContent('재고: 20개');
      expect(product2).toHaveTextContent('상품2');
      expect(product2).toHaveTextContent('20,000원');
      expect(product2).toHaveTextContent('재고: 20개');
      expect(product3).toHaveTextContent('상품3');
      expect(product3).toHaveTextContent('30,000원');
      expect(product3).toHaveTextContent('재고: 20개');

      // 2. 할인 정보 표시
      expect(screen.getByText('10개 이상: 10% 할인')).toBeInTheDocument();

      // 3. 상품1 장바구니에 상품 추가
      fireEvent.click(addToCartButtonsAtProduct1); // 상품1 추가

      // 4. 할인율 계산
      expect(screen.getByText('상품 금액: 10,000원')).toBeInTheDocument();
      expect(screen.getByText('할인 금액: 0원')).toBeInTheDocument();
      expect(screen.getByText('최종 결제 금액: 10,000원')).toBeInTheDocument();

      // 5. 상품 품절 상태로 만들기
      for (let i = 0; i < 19; i++) {
        fireEvent.click(addToCartButtonsAtProduct1);
      }

      // 6. 품절일 때 상품 추가 안 되는지 확인하기
      expect(product1).toHaveTextContent('재고: 0개');
      fireEvent.click(addToCartButtonsAtProduct1);
      expect(product1).toHaveTextContent('재고: 0개');

      // 7. 할인율 계산
      expect(screen.getByText('상품 금액: 200,000원')).toBeInTheDocument();
      expect(screen.getByText('할인 금액: 20,000원')).toBeInTheDocument();
      expect(screen.getByText('최종 결제 금액: 180,000원')).toBeInTheDocument();

      // 8. 상품을 각각 10개씩 추가하기
      fireEvent.click(addToCartButtonsAtProduct2); // 상품2 추가
      fireEvent.click(addToCartButtonsAtProduct3); // 상품3 추가

      const increaseButtons = screen.getAllByText('+');
      for (let i = 0; i < 9; i++) {
        fireEvent.click(increaseButtons[1]); // 상품2
        fireEvent.click(increaseButtons[2]); // 상품3
      }

      // 9. 할인율 계산
      expect(screen.getByText('상품 금액: 700,000원')).toBeInTheDocument();
      expect(screen.getByText('할인 금액: 110,000원')).toBeInTheDocument();
      expect(screen.getByText('최종 결제 금액: 590,000원')).toBeInTheDocument();

      // 10. 쿠폰 적용하기
      const couponSelect = screen.getByRole('combobox');
      fireEvent.change(couponSelect, { target: { value: '1' } }); // 10% 할인 쿠폰 선택

      // 11. 할인율 계산
      expect(screen.getByText('상품 금액: 700,000원')).toBeInTheDocument();
      expect(screen.getByText('할인 금액: 169,000원')).toBeInTheDocument();
      expect(screen.getByText('최종 결제 금액: 531,000원')).toBeInTheDocument();

      // 12. 다른 할인 쿠폰 적용하기
      fireEvent.change(couponSelect, { target: { value: '0' } }); // 5000원 할인 쿠폰
      expect(screen.getByText('상품 금액: 700,000원')).toBeInTheDocument();
      expect(screen.getByText('할인 금액: 115,000원')).toBeInTheDocument();
      expect(screen.getByText('최종 결제 금액: 585,000원')).toBeInTheDocument();
    });

    test('관리자 페이지 테스트 > ', async () => {
      render(<TestAdminPage />);

      const $product1 = screen.getByTestId('product-1');

      // 1. 새로운 상품 추가
      fireEvent.click(screen.getByText('새 상품 추가'));

      fireEvent.change(screen.getByLabelText('상품명'), {
        target: { value: '상품4' },
      });
      fireEvent.change(screen.getByLabelText('가격'), {
        target: { value: '15000' },
      });
      fireEvent.change(screen.getByLabelText('재고'), {
        target: { value: '30' },
      });

      fireEvent.click(screen.getByText('추가'));

      const $product4 = screen.getByTestId('product-4');

      expect($product4).toHaveTextContent('상품4');
      expect($product4).toHaveTextContent('15000원');
      expect($product4).toHaveTextContent('재고: 30');

      // 2. 상품 선택 및 수정
      fireEvent.click($product1);
      fireEvent.click(within($product1).getByTestId('toggle-button'));
      fireEvent.click(within($product1).getByTestId('modify-button'));

      act(() => {
        fireEvent.change(within($product1).getByDisplayValue('20'), {
          target: { value: '25' },
        });
        fireEvent.change(within($product1).getByDisplayValue('10000'), {
          target: { value: '12000' },
        });
        fireEvent.change(within($product1).getByDisplayValue('상품1'), {
          target: { value: '수정된 상품1' },
        });
      });

      fireEvent.click(within($product1).getByText('수정 완료'));

      expect($product1).toHaveTextContent('수정된 상품1');
      expect($product1).toHaveTextContent('12000원');
      expect($product1).toHaveTextContent('재고: 25');

      // 3. 상품 할인율 추가 및 삭제
      fireEvent.click($product1);
      fireEvent.click(within($product1).getByTestId('modify-button'));

      // 할인 추가
      act(() => {
        fireEvent.change(screen.getByPlaceholderText('수량'), {
          target: { value: '5' },
        });
        fireEvent.change(screen.getByPlaceholderText('할인율 (%)'), {
          target: { value: '5' },
        });
      });
      fireEvent.click(screen.getByText('할인 추가'));

      expect(
        screen.queryByText('5개 이상 구매 시 5% 할인'),
      ).toBeInTheDocument();

      // 할인 삭제
      fireEvent.click(screen.getAllByText('삭제')[0]);
      expect(
        screen.queryByText('10개 이상 구매 시 10% 할인'),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText('5개 이상 구매 시 5% 할인'),
      ).toBeInTheDocument();

      fireEvent.click(screen.getAllByText('삭제')[0]);
      expect(
        screen.queryByText('10개 이상 구매 시 10% 할인'),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText('5개 이상 구매 시 5% 할인'),
      ).not.toBeInTheDocument();

      // 4. 쿠폰 추가
      fireEvent.change(screen.getByPlaceholderText('쿠폰 이름'), {
        target: { value: '새 쿠폰' },
      });
      fireEvent.change(screen.getByPlaceholderText('쿠폰 코드'), {
        target: { value: 'NEW10' },
      });
      fireEvent.change(screen.getByRole('combobox'), {
        target: { value: 'percentage' },
      });
      fireEvent.change(screen.getByPlaceholderText('할인 값'), {
        target: { value: '10' },
      });

      fireEvent.click(screen.getByText('쿠폰 추가'));

      const $newCoupon = screen.getByTestId('coupon-3');

      expect($newCoupon).toHaveTextContent('새 쿠폰 (NEW10):10% 할인');
    });
  });

  describe('자유롭게 작성해보세요.', () => {
    describe('utils.ts 함수 테스트', () => {
      test('convertToLocaleString 함수는 숫자를 로케일 문자열로 변환해야 한다', () => {
        expect(convertToLocaleString(1000)).toBe('1,000');
        expect(convertToLocaleString(1000000)).toBe('1,000,000');
        expect(convertToLocaleString(0)).toBe('0');
        expect(convertToLocaleString(-1000)).toBe('-1,000');
      });

      test('getPercent 함수는 소수를 백분율로 변환해야 한다', () => {
        expect(getPercent(0.1)).toBe(10);
        expect(getPercent(0.25)).toBe(25);
        expect(getPercent(1)).toBe(100);
        expect(getPercent(0)).toBe(0);
      });

      test('getWholeNumberPercent 함수는 소수를 정수 백분율 문자열로 변환해야 한다', () => {
        expect(getWholeNumberPercent(0.1)).toBe('10');
        expect(getWholeNumberPercent(0.256)).toBe('26');
        expect(getWholeNumberPercent(1)).toBe('100');
        expect(getWholeNumberPercent(0)).toBe('0');
      });
    });

    describe('models/cart.ts 함수 테스트', () => {
      const mockProduct1: Product = {
        id: 'test1',
        name: '테스트 상품1',
        price: 10000,
        stock: 10,
        discounts: [{ quantity: 5, rate: 0.1 }],
      };

      const mockProduct2: Product = {
        id: 'test2',
        name: '테스트 상품2',
        price: 20000,
        stock: 5,
        discounts: [],
      };

      const mockCart: Cart = [
        { product: mockProduct1, quantity: 2 },
        { product: mockProduct2, quantity: 1 },
      ];

      test('findCartItemById 함수는 카트에서 상품을 찾아야 한다', () => {
        const found = findCartItemById(mockCart, 'test1');
        const notFound = findCartItemById(mockCart, 'nonexistent');

        expect(found).toBeDefined();
        expect(found?.product.id).toBe('test1');
        expect(found?.quantity).toBe(2);
        expect(notFound).toBeUndefined();

        // 원본 객체와 다른 참조를 반환하는지 확인
        const foundItem = findCartItemById(mockCart, 'test1');
        expect(foundItem).not.toBe(mockCart[0]);
      });

      test('makeCartItem 함수는 새로운 장바구니 아이템을 생성해야 한다', () => {
        const cartItem = makeCartItem(mockProduct1, 3);

        expect(cartItem).toEqual({
          product: mockProduct1,
          quantity: 3,
        });
      });

      test('addNewItemToCart 함수는 새로운 상품을 장바구니에 추가해야 한다', () => {
        const newProduct: Product = {
          id: 'test3',
          name: '테스트 상품3',
          price: 30000,
          stock: 8,
          discounts: [],
        };

        const updatedCart = addNewItemToCart(mockCart, newProduct);

        expect(updatedCart).toHaveLength(mockCart.length + 1);
        expect(updatedCart[updatedCart.length - 1]).toEqual({
          product: newProduct,
          quantity: 1,
        });

        // 원본 카트가 변경되지 않았는지 확인
        expect(mockCart).toHaveLength(2);
      });

      test('removeItemFromCart 함수는 장바구니에서 상품을 제거해야 한다', () => {
        const updatedCart = removeItemFromCart(mockCart, 'test1');

        expect(updatedCart).toHaveLength(mockCart.length - 1);
        expect(
          updatedCart.find((item) => item.product.id === 'test1'),
        ).toBeUndefined();
        expect(
          updatedCart.find((item) => item.product.id === 'test2'),
        ).toBeDefined();

        // 존재하지 않는 상품 ID로 제거 시도
        const sameCart = removeItemFromCart(mockCart, 'nonexistent');
        expect(sameCart).toHaveLength(mockCart.length);

        // 원본 카트가 변경되지 않았는지 확인
        expect(mockCart).toHaveLength(2);
      });
    });

    describe('models/coupons.ts 함수 테스트', () => {
      test('discountAmount 함수는 쿠폰의 할인 정보를 문자열로 반환해야 한다', () => {
        const amountCoupon: Coupon = {
          name: '5000원 할인',
          code: 'AMOUNT5000',
          discountType: 'amount',
          discountValue: 5000,
        };

        const percentageCoupon: Coupon = {
          name: '10% 할인',
          code: 'PERCENT10',
          discountType: 'percentage',
          discountValue: 10,
        };

        expect(discountAmount(amountCoupon)).toBe('5000원');
        expect(discountAmount(percentageCoupon)).toBe('10%');
      });
    });

    describe('models/products.ts 함수 테스트', () => {
      const mockProduct1: Product = {
        id: 'test1',
        name: '테스트 상품1',
        price: 10000,
        stock: 10,
        discounts: [{ quantity: 5, rate: 0.1 }],
      };

      const mockProduct2: Product = {
        id: 'test2',
        name: '테스트 상품2',
        price: 20000,
        stock: 5,
        discounts: [],
      };

      const mockProducts = [mockProduct1, mockProduct2];

      test('updateProduct 함수는 상품 목록에서 특정 상품을 업데이트해야 한다', () => {
        const updatedProduct = {
          ...mockProduct1,
          price: 15000,
          stock: 15,
        };

        const newProducts = updateProduct(mockProducts, updatedProduct);

        expect(newProducts).toHaveLength(mockProducts.length);
        expect(newProducts.find((p) => p.id === 'test1')?.price).toBe(15000);
        expect(newProducts.find((p) => p.id === 'test1')?.stock).toBe(15);
        expect(newProducts.find((p) => p.id === 'test2')).toEqual(mockProduct2);

        // 원본 배열이 변경되지 않았는지 확인
        expect(mockProducts[0].price).toBe(10000);
      });

      test('addProduct 함수는 상품 목록에 새로운 상품을 추가해야 한다', () => {
        const newProduct: Product = {
          id: 'test3',
          name: '테스트 상품3',
          price: 30000,
          stock: 8,
          discounts: [],
        };

        const newProducts = addProduct(mockProducts, newProduct);

        expect(newProducts).toHaveLength(mockProducts.length + 1);
        expect(newProducts[newProducts.length - 1]).toEqual(newProduct);

        // 원본 배열이 변경되지 않았는지 확인
        expect(mockProducts).toHaveLength(2);
      });

      test('hasDiscount 함수는 상품의 할인 여부를 반환해야 한다', () => {
        expect(hasDiscount(mockProduct1)).toBe(true);
        expect(hasDiscount(mockProduct2)).toBe(false);
      });

      test('addDiscountToProduct 함수는 상품에 새로운 할인을 추가해야 한다', () => {
        const newDiscount: Discount = { quantity: 3, rate: 0.05 };
        const updatedProduct = addDiscountToProduct(mockProduct2, newDiscount);

        expect(updatedProduct.discounts).toHaveLength(1);
        expect(updatedProduct.discounts[0]).toEqual(newDiscount);

        // 원본 객체가 변경되지 않았는지 확인
        expect(mockProduct2.discounts).toHaveLength(0);
      });

      test('removeDiscountFromProduct 함수는 상품에서 특정 할인을 제거해야 한다', () => {
        const productWithMultipleDiscounts: Product = {
          ...mockProduct1,
          discounts: [
            { quantity: 5, rate: 0.1 },
            { quantity: 10, rate: 0.2 },
          ],
        };

        const updatedProduct = removeDiscountFromProduct(
          productWithMultipleDiscounts,
          0,
        );

        expect(updatedProduct.discounts).toHaveLength(1);
        expect(updatedProduct.discounts[0]).toEqual({
          quantity: 10,
          rate: 0.2,
        });

        // 원본 객체가 변경되지 않았는지 확인
        expect(productWithMultipleDiscounts.discounts).toHaveLength(2);

        // 존재하지 않는 인덱스로 제거 시도
        const sameProduct = removeDiscountFromProduct(mockProduct2, 0);
        expect(sameProduct.discounts).toHaveLength(0);
      });
    });

    describe('Naviation hooks 테스트', () => {
      test('useTogglePage hook은 페이지 전환 상태를 관리해야 한다', () => {
        const TestComponent = () => {
          const { isAdmin, switchPage } = useTogglePage();
          return (
            <div>
              <span data-testid='admin-status'>{isAdmin.toString()}</span>
              <button onClick={switchPage}>Toggle</button>
            </div>
          );
        };

        render(<TestComponent />);

        // 초기 상태 확인
        expect(screen.getByTestId('admin-status').textContent).toBe('false');

        // 페이지 전환
        fireEvent.click(screen.getByText('Toggle'));
        expect(screen.getByTestId('admin-status').textContent).toBe('true');

        // 다시 페이지 전환
        fireEvent.click(screen.getByText('Toggle'));
        expect(screen.getByTestId('admin-status').textContent).toBe('false');
      });
    });

    describe('EditProduct - AddDiscout - hooks 테스트', () => {
      test('useDiscountForm hook은 할인 폼 상태를 관리해야 한다', () => {
        const TestComponent = () => {
          const { newDiscount, updateDiscountField, resetDiscountForm } =
            useDiscountForm();
          return (
            <div>
              <span data-testid='quantity'>{newDiscount.quantity}</span>
              <span data-testid='rate'>{newDiscount.rate}</span>
              <button onClick={() => updateDiscountField('quantity', 10)}>
                Update Quantity
              </button>
              <button onClick={() => updateDiscountField('rate', 0.2)}>
                Update Rate
              </button>
              <button onClick={resetDiscountForm}>Reset</button>
            </div>
          );
        };

        render(<TestComponent />);

        // 초기 상태 확인
        expect(screen.getByTestId('quantity').textContent).toBe('0');
        expect(screen.getByTestId('rate').textContent).toBe('0');

        // quantity 업데이트
        fireEvent.click(screen.getByText('Update Quantity'));
        expect(screen.getByTestId('quantity').textContent).toBe('10');
        expect(screen.getByTestId('rate').textContent).toBe('0');

        // rate 업데이트
        fireEvent.click(screen.getByText('Update Rate'));
        expect(screen.getByTestId('quantity').textContent).toBe('10');
        expect(screen.getByTestId('rate').textContent).toBe('0.2');

        // 폼 초기화
        fireEvent.click(screen.getByText('Reset'));
        expect(screen.getByTestId('quantity').textContent).toBe('0');
        expect(screen.getByTestId('rate').textContent).toBe('0');
      });
    });
  });
});
