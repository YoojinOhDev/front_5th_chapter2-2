import { Coupon } from '../../../../types.ts';
import { AddCoupon } from './components/AddCoupon';
import { CouponList } from './components/CouponList';

interface Props {
  coupons: Coupon[];
  onCouponAdd: (newCoupon: Coupon) => void;
}

export const CouponAdmin = ({ coupons, onCouponAdd }: Props) => {
  return (
    <div id={'쿠폰 관리'}>
      <h2 className='text-2xl font-semibold mb-4'>쿠폰 관리</h2>
      <div className='bg-white p-4 rounded shadow'>
        <AddCoupon onCouponAdd={onCouponAdd} />
        <CouponList coupons={coupons} />
      </div>
    </div>
  );
};
