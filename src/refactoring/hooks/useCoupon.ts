import { useState } from 'react';
import { Coupon } from '../../types.ts';

export type ApplyCoupon = (coupon: Coupon) => void;
export type SelectedCoupon = Coupon | null;

export const useCoupons = (
  initialCoupons: Coupon[],
): {
  coupons: Coupon[];
  addCoupon: (newCoupon: Coupon) => void;
} => {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);

  function addCoupon(newCoupon: Coupon): void {
    setCoupons((prevCoupons) => [...prevCoupons, newCoupon]);
  }

  return {
    coupons,
    addCoupon,
  };
};
