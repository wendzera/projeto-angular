import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CartService } from '../services/cart.service';
import { SupabaseService } from '../services/supabase.service';
import { CartItem } from '../models/cart-item';
import { OrderSummaryDialogComponent } from '../order-summary-dialog/order-summary-dialog.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    FormsModule,
    MatButtonModule, 
    MatIconModule, 
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  cartService = inject(CartService);
  supabaseService = inject(SupabaseService);
  dialog = inject(MatDialog);
  snackBar = inject(MatSnackBar);
  cep: string = '';
  isProcessing = false;

  get items(): CartItem[] {
    return this.cartService.items();
  }

  get subtotal(): number {
    return this.cartService.subtotal();
  }

  get freight(): number {
    return this.cartService.freight();
  }

  get total(): number {
    return this.cartService.total();
  }

  get hasCep(): boolean {
    return this.cartService.getCep().length > 0;
  }

  getItemTotal(item: CartItem): number {
    return item.product.price * item.quantity;
  }

  async increment(productId: number): Promise<void> {
    await this.cartService.incrementQuantity(productId);
  }

  async decrement(productId: number): Promise<void> {
    await this.cartService.decrementQuantity(productId);
  }

  async removeItem(productId: number): Promise<void> {
    if (confirm('Deseja remover este item do carrinho?')) {
      await this.cartService.removeItem(productId);
    }
  }

  onCepChange(): void {
    this.cartService.setCep(this.cep);
  }

  formatCep(cep: string): string {
    // Format: 12345-678
    if (cep.length === 8) {
      return `${cep.substring(0, 5)}-${cep.substring(5)}`;
    }
    return cep;
  }

  openOrderSummary(): void {
    if (!this.hasCep) {
      alert('Por favor, informe o CEP para calcular o frete.');
      return;
    }

    if (this.items.length === 0) {
      alert('Seu carrinho está vazio.');
      return;
    }

    const dialogRef = this.dialog.open(OrderSummaryDialogComponent, {
      width: '600px',
      data: {
        items: this.items,
        subtotal: this.subtotal,
        freight: this.freight,
        total: this.total,
        cep: this.cartService.getCep()
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        this.finalizeOrder();
      } else if (result === 'continue') {
        // User wants to continue shopping
        // Navigation will be handled in the dialog
      }
      // If 'cancel', do nothing
    });
  }

  async finalizeOrder(): Promise<void> {
    if (this.isProcessing) return;

    try {
      this.isProcessing = true;

      // Verifica se há usuário logado
      const user = this.supabaseService.user();
      if (!user) {
        this.snackBar.open('Você precisa estar logado para finalizar o pedido', 'Fechar', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        return;
      }

      // Cria o pedido principal (isso automaticamente associa os itens do carrinho ao pedido)
      const order = await this.supabaseService.createOrder({
        total: this.total,
        customer_name: user.email?.split('@')[0] || 'Cliente',
        customer_email: user.email || '',
        customer_phone: '',
        customer_address: `CEP: ${this.formatCep(this.cartService.getCep())}`
      });

      // Sucesso!
      this.snackBar.open(
        `Pedido #${order.id} finalizado com sucesso! Total: R$ ${this.total.toFixed(2)}`,
        'Fechar',
        {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        }
      );

      // Recarrega o carrinho (que agora estará vazio pois os itens têm order_id)
      await this.cartService.loadCart();
      this.cep = '';
    } catch (error: any) {
      console.error('Erro ao finalizar pedido:', error);
      this.snackBar.open(
        'Erro ao finalizar pedido: ' + (error.message || 'Erro desconhecido'),
        'Fechar',
        {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        }
      );
    } finally {
      this.isProcessing = false;
    }
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://via.placeholder.com/100?text=Sem+Imagem';
  }
}
