import { Cart, CartItem, Coupon, Product } from '../../types';

export const calculateItemTotal = (item: CartItem) => {
  const { price } = item.product;
  const { quantity } = item;
  const discount = getMaxApplicableDiscount(item);
  return price * quantity * (1 - discount);
};

//todo: 아래 두 함수가 유사점이 많아 보이는데..
export const getMaxApplicableDiscount = (item: CartItem) => {
  return item.product.discounts.reduce((maxDiscount, d) => {
    return item.quantity >= d.quantity && d.rate > maxDiscount
      ? d.rate
      : maxDiscount;
  }, 0);
};

export const getMaxDiscountRate = (
  discounts: { quantity: number; rate: number }[],
) => {
  return discounts.reduce((max, discount) => Math.max(max, discount.rate), 0);
};

export type TotalPrices = {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
  totalDiscount: number;
};

export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null,
): TotalPrices => {
  let totalBeforeDiscount = 0;
  let totalAfterDiscount = 0;

  cart.forEach((item) => {
    totalBeforeDiscount += item.product.price * item.quantity;
    totalAfterDiscount += calculateItemTotal(item);
  });

  let totalDiscount = totalBeforeDiscount - totalAfterDiscount;

  if (selectedCoupon) {
    if (selectedCoupon.discountType === 'amount') {
      totalAfterDiscount = Math.max(
        0,
        totalAfterDiscount - selectedCoupon.discountValue,
      );
    } else {
      totalAfterDiscount *= 1 - selectedCoupon.discountValue / 100;
    }
    totalDiscount = totalBeforeDiscount - totalAfterDiscount;
  }

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
    totalDiscount: Math.round(totalDiscount),
  };
};

export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number,
): CartItem[] => {
  return cart
    .map((item) => {
      if (item.product.id !== productId) {
        return item;
      }

      const maxQuantity = item.product.stock;
      const updatedQuantity = Math.max(0, Math.min(newQuantity, maxQuantity));

      return updatedQuantity > 0
        ? { ...item, quantity: updatedQuantity }
        : null;
    })
    .filter((item): item is CartItem => item !== null);
};

export const findCartItemById = (
  cart: Cart,
  id: string,
): CartItem | undefined => {
  const foundItem = cart.find((item) => item.product.id === id);
  return foundItem ? { ...foundItem } : undefined;
};

export const makeCartItem = (product: Product, quantity: number) => ({ product, quantity });

export const addNewItemToCart = (prevCart: Cart, product: Product): Cart => [
  ...prevCart,
  makeCartItem(product, 1),
];

export const addExitingItemToCart = (prevCart: Cart, product: Product) =>
  prevCart.map((item) =>
    item.product.id === product.id
      ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
      : item,
  );

export const removeItemFromCart = (prevCart: Cart, productId: string) => {
  return prevCart
    .map((item) => {
      return item.product.id === productId ? null : item;
    })
    .filter((item): item is CartItem => item !== null);
};
