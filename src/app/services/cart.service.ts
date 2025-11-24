import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { Product } from '../models/product';
import { CartItem } from '../models/cart-item';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class CartService {
  private supabaseService = inject(SupabaseService);
  private cartItems = signal<CartItem[]>([]);
  private cep = signal<string>('');
  private isLoading = signal<boolean>(false);

  // Computed signals
  items = this.cartItems.asReadonly();
  loading = this.isLoading.asReadonly();
  
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

  constructor() {
    // Carrega o carrinho quando o usuário logar
    effect(() => {
      const user = this.supabaseService.user();
      if (user) {
        this.loadCart();
      } else {
        this.cartItems.set([]);
      }
    });
  }

  // Load cart from database
  async loadCart(): Promise<void> {
    try {
      this.isLoading.set(true);
      const items = await this.supabaseService.getCartItems();
      
      const cartItems: CartItem[] = items.map((item: any) => ({
        id: item.id,
        product: item.products,
        quantity: item.quantity
      }));
      
      this.cartItems.set(cartItems);
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  // Add product to cart
  async addToCart(product: Product): Promise<void> {
    try {
      await this.supabaseService.addToCart(product.id!, 1);
      await this.loadCart();
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      throw error;
    }
  }

  // Increment quantity
  async incrementQuantity(productId: number): Promise<void> {
    const item = this.cartItems().find(i => i.product.id === productId);
    if (!item || !item.id) return;

    try {
      await this.supabaseService.updateCartItemQuantity(item.id, item.quantity + 1);
      await this.loadCart();
    } catch (error) {
      console.error('Erro ao incrementar quantidade:', error);
    }
  }

  // Decrement quantity (minimum 1)
  async decrementQuantity(productId: number): Promise<void> {
    const item = this.cartItems().find(i => i.product.id === productId);
    if (!item || !item.id || item.quantity <= 1) return;

    try {
      await this.supabaseService.updateCartItemQuantity(item.id, item.quantity - 1);
      await this.loadCart();
    } catch (error) {
      console.error('Erro ao decrementar quantidade:', error);
    }
  }

  // Remove item from cart
  async removeItem(productId: number): Promise<void> {
    const item = this.cartItems().find(i => i.product.id === productId);
    if (!item || !item.id) return;

    try {
      await this.supabaseService.removeFromCart(item.id);
      await this.loadCart();
    } catch (error) {
      console.error('Erro ao remover item:', error);
    }
  }

  // Clear cart
  async clearCart(): Promise<void> {
    try {
      await this.supabaseService.clearCart();
      this.cartItems.set([]);
      this.cep.set('');
    } catch (error) {
      console.error('Erro ao limpar carrinho:', error);
    }
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
