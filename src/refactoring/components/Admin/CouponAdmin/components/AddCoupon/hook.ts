import { ChangeEvent, useState } from 'react';
import { Coupon } from '../../../../../../types.ts';
import { defaultNewCoupon } from '../../data.ts';
import { getNewCoupon } from '../../logic.ts';

export type CouponFieldName =
  | 'name'
  | 'code'
  | 'discountType'
  | 'discountValue';

export function useCouponAdmin(onCouponAdd: (newCoupon: Coupon) => void) {
  const [newCoupon, setNewCoupon] = useState<Coupon>(defaultNewCoupon);

  const handleAddCoupon = () => {
    onCouponAdd(newCoupon);
    setNewCoupon(defaultNewCoupon); // 새 쿠폰 입력 input들 초기화
  };

  const changeCouponHandler =
    (fieldName: CouponFieldName) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setNewCoupon((prev) =>
        getNewCoupon(prev, { fieldName, value: e.target.value }),
      );

  return {
    newCoupon,
    handleAddCoupon,
    changeCouponHandler,
  };
}
