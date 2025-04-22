import { ChangeEvent } from 'react';

export const defaultProduct = {
  name: '',
  price: 0,
  stock: 0,
  discounts: [],
};

interface FormInputField {
  type: 'text' | 'number';
  formatter: (e: ChangeEvent<HTMLInputElement>) => string | number;
  id: string;
  label: string;
  key: 'name' | 'price' | 'stock';
}

type TypeAndFormatter = Record<
  FormInputField['type'],
  {
    type: FormInputField['type'];
    formatter: FormInputField['formatter'];
  }
>;

const typeAndFormatter: TypeAndFormatter = {
  text: {
    type: 'text',
    formatter: (e) => e.target.value,
  },
  number: {
    type: 'number',
    formatter: (e) => parseInt(e.target.value),
  },
};

export const formInputFields: FormInputField[] = [
  {
    ...typeAndFormatter.text,
    id: 'productName',
    label: '상품명',
    key: 'name',
  },
  {
    ...typeAndFormatter.number,
    id: 'productPrice',
    label: '가격',
    key: 'price',
  },
  {
    ...typeAndFormatter['number'],
    id: 'productStock',
    label: '재고',
    key: 'stock',
  },
];
