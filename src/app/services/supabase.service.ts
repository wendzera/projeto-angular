import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { Product } from '../models/product';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private supabase: SupabaseClient;
  private sessionInitialized = false;
  
  // Produtos
  products = signal<Product[]>([]);
  
  // Usuário logado
  user = signal<User | null>(null);

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      }
    });
    
    // Inicializa usuário apenas uma vez
    if (!this.sessionInitialized) {
      this.sessionInitialized = true;
      this.initSession().catch(err => console.error('Erro ao inicializar sessão:', err));

      // Observa mudanças de autenticação
      this.supabase.auth.onAuthStateChange((_event, session) => {
        this.user.set(session?.user ?? null);
      });
    }
  }
  
  // Inicializa a sessão do usuário
  private async initSession() {
    try {
      const { data } = await this.supabase.auth.getSession();
      this.user.set(data.session?.user ?? null);
    } catch (error) {
      console.error('Erro ao obter sessão:', error);
      this.user.set(null);
    }
  }

  // -------------------------
  // Auth
  // -------------------------

  async login(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({ 
      email, 
      password 
    });
    
    if (error) throw error;
    this.user.set(data.user);
    return data.user;
  }

  async register(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          email_confirmed: true // Confirma email automaticamente
        }
      }
    });
    
    if (error) {
      console.error('Supabase signup error:', error);
      throw error;
    }
    
    // Verifica se o usuário foi criado com sucesso
    if (!data.user) {
      throw new Error('Erro ao criar usuário. Tente novamente.');
    }
    
    console.log('Usuário criado:', data.user);
    console.log('Session:', data.session);
    
    return data.user;
  }

  async logout() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
    this.user.set(null);
  }

  // -------------------------
  // Produtos (CRUD)
  // -------------------------

  async loadProducts() {
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) throw error;
    this.products.set(data as Product[]);
  }

  async addProduct(product: Product) {
    const { error } = await this.supabase.from('products').insert([product]);
    if (error) throw error;
    await this.loadProducts();
  }

  async updateProduct(id: number, updates: Partial<Product>) {
    const { error } = await this.supabase.from('products').update(updates).eq('id', id);
    if (error) throw error;
    await this.loadProducts();
  }

  async deleteProduct(id: number) {
    const { error } = await this.supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    await this.loadProducts();
  }

  // -------------------------
  // Carrinho (Order Items)
  // -------------------------

  async getCartItems() {
    const currentUser = this.user();
    if (!currentUser) return [];

    try {
      const { data, error } = await this.supabase
        .from('order_items')
        .select(`
          *,
          products (*)
        `)
        .eq('user_id', currentUser.id)
        .is('order_id', null)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Erro ao buscar itens do carrinho:', error);
        throw error;
      }
      
      return data || [];
    } catch (error: any) {
      console.error('Erro detalhado ao carregar carrinho:', error);
      return [];
    }
  }

  async addToCart(productId: number, quantity: number = 1) {
    const currentUser = this.user();
    if (!currentUser) {
      throw new Error('Usuário não autenticado');
    }

    try {
      // Verifica se o item já existe no carrinho
      const { data: existing, error: selectError } = await this.supabase
        .from('order_items')
        .select('*')
        .eq('user_id', currentUser.id)
        .eq('product_id', productId)
        .is('order_id', null)
        .maybeSingle();

      if (selectError) {
        console.error('Erro ao verificar item no carrinho:', selectError);
        throw selectError;
      }

      if (existing) {
        // Atualiza quantidade
        const { error } = await this.supabase
          .from('order_items')
          .update({ quantity: existing.quantity + quantity })
          .eq('id', existing.id);
        
        if (error) {
          console.error('Erro ao atualizar quantidade:', error);
          throw error;
        }
      } else {
        // Adiciona novo item
        const { error } = await this.supabase
          .from('order_items')
          .insert([{
            user_id: currentUser.id,
            product_id: productId,
            quantity: quantity
          }]);
        
        if (error) {
          console.error('Erro ao inserir item:', error);
          throw error;
        }
      }
    } catch (error: any) {
      console.error('Erro detalhado ao adicionar ao carrinho:', error);
      throw new Error(error.message || 'Erro ao adicionar produto ao carrinho');
    }
  }

  async updateCartItemQuantity(itemId: number, quantity: number) {
    if (quantity <= 0) {
      return this.removeFromCart(itemId);
    }

    const { error } = await this.supabase
      .from('order_items')
      .update({ quantity })
      .eq('id', itemId);

    if (error) throw error;
  }

  async removeFromCart(itemId: number) {
    const { error } = await this.supabase
      .from('order_items')
      .delete()
      .eq('id', itemId);

    if (error) throw error;
  }

  async clearCart() {
    const currentUser = this.user();
    if (!currentUser) return;

    const { error } = await this.supabase
      .from('order_items')
      .delete()
      .eq('user_id', currentUser.id)
      .is('order_id', null);

    if (error) throw error;
  }

  // -------------------------
  // Pedidos (Orders)
  // -------------------------

  async createOrder(orderData: {
    total: number;
    customer_name: string;
    customer_email: string;
    customer_phone?: string;
    customer_address?: string;
  }) {
    const currentUser = this.user();
    if (!currentUser) {
      throw new Error('Usuário não autenticado');
    }

    // Cria o pedido
    const { data: order, error: orderError } = await this.supabase
      .from('orders')
      .insert([{
        user_id: currentUser.id,
        total: orderData.total,
        status: 'pending',
        customer_name: orderData.customer_name,
        customer_email: orderData.customer_email,
        customer_phone: orderData.customer_phone,
        customer_address: orderData.customer_address
      }])
      .select()
      .single();

    if (orderError) throw orderError;

    // Associa os itens do carrinho ao pedido
    const { error: updateError } = await this.supabase
      .from('order_items')
      .update({ order_id: order.id })
      .eq('user_id', currentUser.id)
      .is('order_id', null);

    if (updateError) throw updateError;

    return order;
  }

  async getUserOrders() {
    const currentUser = this.user();
    if (!currentUser) {
      throw new Error('Usuário não autenticado');
    }

    const { data, error } = await this.supabase
      .from('orders')
      .select(`
        *,
        order_items!inner (
          *,
          products (*)
        )
      `)
      .eq('user_id', currentUser.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
}
