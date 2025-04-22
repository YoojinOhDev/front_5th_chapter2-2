import { useState } from 'react';
import { Coupon } from '../../../../types.ts';
import { defaultNewCoupon } from './data.ts';
import { discountAmount } from '../../../models/coupons.ts';

interface Props {
  coupons: Coupon[];
  onCouponAdd: (newCoupon: Coupon) => void;
}

export const CouponAdmin = ({ coupons, onCouponAdd }: Props) => {
  const [newCoupon, setNewCoupon] = useState<Coupon>(defaultNewCoupon);

  const handleAddCoupon = () => {
    onCouponAdd(newCoupon);
    setNewCoupon(defaultNewCoupon);
  };

  function handleChangeCoupon(fieldName: string, value: string | number) {
    setNewCoupon({ ...newCoupon, [fieldName]: value });
  }

  return (
    <div id={'쿠폰 관리'}>
      <h2 className='text-2xl font-semibold mb-4'>쿠폰 관리</h2>
      <div className='bg-white p-4 rounded shadow'>
        <div className='space-y-2 mb-4'>
          <input
            type='text'
            placeholder='쿠폰 이름'
            value={newCoupon.name}
            onChange={(e) => handleChangeCoupon('name', e.target.value)}
            className='w-full p-2 border rounded'
          />
          <input
            type='text'
            placeholder='쿠폰 코드'
            value={newCoupon.code}
            onChange={(e) => handleChangeCoupon('code', e.target.value)}
            className='w-full p-2 border rounded'
          />
          <div className='flex gap-2'>
            <select
              value={newCoupon.discountType}
              onChange={(e) =>
                handleChangeCoupon(
                  'discountType',
                  e.target.value as 'amount' | 'percentage',
                )
              }
              className='w-full p-2 border rounded'
            >
              <option value='amount'>금액(원)</option>
              <option value='percentage'>할인율(%)</option>
            </select>
            <input
              type='number'
              placeholder='할인 값'
              value={newCoupon.discountValue}
              onChange={(e) =>
                handleChangeCoupon('discountValue', parseInt(e.target.value))
              }
              className='w-full p-2 border rounded'
            />
          </div>
          <button
            onClick={handleAddCoupon}
            className='w-full bg-green-500 text-white p-2 rounded hover:bg-green-600'
          >
            쿠폰 추가
          </button>
        </div>
        <div>
          <h3 className='text-lg font-semibold mb-2'>현재 쿠폰 목록</h3>
          <div className='space-y-2'>
            {coupons.map((coupon, index) => (
              <div
                key={index}
                data-testid={`coupon-${index + 1}`}
                className='bg-gray-100 p-2 rounded'
              >
                {coupon.name} ({coupon.code}):
                {discountAmount(coupon)} 할인
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
