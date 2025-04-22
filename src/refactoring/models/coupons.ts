import { Coupon } from '../../types.ts';

export const discountAmount = (coupon: Coupon) =>
  coupon.discountType === 'amount'
    ? `${coupon.discountValue}원`
    : `${coupon.discountValue}%`;
