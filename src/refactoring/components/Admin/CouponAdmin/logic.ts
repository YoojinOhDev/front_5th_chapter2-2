import { Coupon } from '../../../../types.ts';
import { CouponFieldName } from './hook.ts';

export function getNewCoupon(
  prevCoupon: Coupon,
  { fieldName, value }: { fieldName: CouponFieldName; value: string },
) {
  const formattedValue =
    fieldName === 'discountValue' ? parseInt(value) : value;
  return { ...prevCoupon, [fieldName]: formattedValue };
}
