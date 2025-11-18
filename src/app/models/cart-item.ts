import { Product } from './product';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  items: CartItem[];
  subtotal: number;
  freight: number;
  total: number;
  cep?: string;
}
