import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../models/product';
import { CartItem } from '../models/cart-item';

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartItems = signal<CartItem[]>([]);
  private cep = signal<string>('');

  // Computed signals
  items = this.cartItems.asReadonly();
  
  subtotal = computed(() => {
    return this.cartItems().reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  });

  freight = computed(() => {
    const subtotalValue = this.subtotal();
    const hasCep = this.cep().length > 0;
    
    if (!hasCep) return 0;
    
    // Frete grátis acima de R$ 100,00
    if (subtotalValue >= 100) return 0;
    
    // Frete fixo de R$ 15,00 para valores abaixo de R$ 100
    return 15;
  });

  total = computed(() => {
    return this.subtotal() + this.freight();
  });

  itemCount = computed(() => {
    return this.cartItems().reduce((sum, item) => sum + item.quantity, 0);
  });

  // Add product to cart
  addToCart(product: Product): void {
    const currentItems = this.cartItems();
    const existingItem = currentItems.find(item => item.product.id === product.id);

    if (existingItem) {
      // Increment quantity if product already exists
      this.cartItems.set(
        currentItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      // Add new item with quantity 1
      this.cartItems.set([...currentItems, { product, quantity: 1 }]);
    }
  }

  // Increment quantity
  incrementQuantity(productId: number): void {
    this.cartItems.set(
      this.cartItems().map(item =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }

  // Decrement quantity (minimum 1)
  decrementQuantity(productId: number): void {
    this.cartItems.set(
      this.cartItems().map(item =>
        item.product.id === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  }

  // Remove item from cart
  removeItem(productId: number): void {
    this.cartItems.set(
      this.cartItems().filter(item => item.product.id !== productId)
    );
  }

  // Clear cart
  clearCart(): void {
    this.cartItems.set([]);
    this.cep.set('');
  }

  // Set CEP
  setCep(cep: string): void {
    // Remove non-numeric characters
    const cleanCep = cep.replace(/\D/g, '');
    this.cep.set(cleanCep);
  }

  // Get CEP
  getCep(): string {
    return this.cep();
  }

  // Check if product is in cart
  isInCart(productId: number): boolean {
    return this.cartItems().some(item => item.product.id === productId);
  }

  // Get item quantity
  getItemQuantity(productId: number): number {
    const item = this.cartItems().find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  }
}
