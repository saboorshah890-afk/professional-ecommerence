export interface Product {
  id: string;
  name: string;
  category: 'Watches' | 'Bags' | 'Eyewear' | 'Everyday Carry';
  price: number;
  tag?: string;
  image: string;
  variants: string[];
}

export interface CartItem extends Product {
  selectedVariant: string;
  quantity: number;
}